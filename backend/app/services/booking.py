"""Booking engine — lõi chống double-booking (KE_HOACH Phase 2 ⭐).

Bảo vệ 3 tầng:
1. `SELECT ... FOR UPDATE` trên row room (qua LockService) — serialize mọi
   transaction đặt cùng phòng.
2. Check trùng đêm trên booking_nights bên trong lock (kèm expire tại chỗ
   các pending đã quá hạn của phòng đó).
3. UNIQUE (room_id, night) ở DB — nếu 1 và 2 có bug thì insert vẫn fail,
   không bao giờ có 2 booking active trùng đêm.
"""

import secrets
import uuid
from datetime import date, datetime, timedelta, timezone
from decimal import Decimal

from sqlalchemy import delete, select, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.models import (
    Booking,
    BookingNight,
    BookingStatus,
    Property,
    Room,
    RoomType,
)
from app.models.property import RoomStatus
from app.services.lock import lock_service
from app.services.pricing import quote_nights

# Trạng thái đang thực sự giữ phòng (booking_nights còn row).
HOLDING_STATUSES = (
    BookingStatus.pending,
    BookingStatus.confirmed,
    BookingStatus.checked_in,
)


class BookingError(Exception):
    pass


class RoomUnavailableError(BookingError):
    """Phòng đã có người giữ ít nhất 1 đêm trong khoảng yêu cầu."""


class InvalidBookingError(BookingError):
    """Input sai: ngày quá khứ, check_out <= check_in, quá dài, phòng bảo trì…"""


class StaleVersionError(BookingError):
    """Optimistic lock fail — trạng thái booking đã bị transaction khác đổi."""


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _gen_code() -> str:
    # Mã ngắn cho khách đọc qua điện thoại: BK + 8 ký tự không nhầm lẫn (0/O, 1/I).
    alphabet = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"
    return "BK" + "".join(secrets.choice(alphabet) for _ in range(8))


async def _expire_stale_holds_for_room(session: AsyncSession, room_id: uuid.UUID) -> None:
    """Expire tại chỗ các pending quá hạn của phòng này (gọi bên trong room lock).

    Không chờ cron: khách mới không bao giờ bị chặn bởi hold đã chết.
    """
    stale_ids = (
        (
            await session.execute(
                select(Booking.id).where(
                    Booking.room_id == room_id,
                    Booking.status == BookingStatus.pending,
                    Booking.expires_at < _now(),
                )
            )
        )
        .scalars()
        .all()
    )
    if not stale_ids:
        return
    await session.execute(
        update(Booking)
        .where(Booking.id.in_(stale_ids), Booking.status == BookingStatus.pending)
        .values(status=BookingStatus.expired, version=Booking.version + 1)
    )
    await session.execute(delete(BookingNight).where(BookingNight.booking_id.in_(stale_ids)))


async def create_booking(
    session: AsyncSession,
    *,
    room_id: uuid.UUID,
    check_in: date,
    check_out: date,
    guest_name: str,
    guest_email: str,
    guest_phone: str | None = None,
    num_guests: int = 1,
    user_id: uuid.UUID | None = None,
    note: str | None = None,
) -> Booking:
    """Tầng 1 soft-hold: tạo booking pending + expires_at, giữ trọn các đêm.

    Commit transaction trước khi return. Raise RoomUnavailableError nếu trùng.
    """
    settings = get_settings()
    today = _now().date()
    if check_in >= check_out:
        raise InvalidBookingError("check_out phải sau check_in")
    if check_in < today:
        raise InvalidBookingError("không đặt ngày quá khứ")
    if (check_out - check_in).days > settings.max_booking_nights:
        raise InvalidBookingError(f"tối đa {settings.max_booking_nights} đêm/booking")

    try:
        # ---- Vùng serialize: giữ room lock tới khi commit ----
        locked = await lock_service.lock_rooms(session, [room_id])
        if not locked:
            raise InvalidBookingError("phòng không tồn tại")
        room: Room = locked[0]
        if room.status != RoomStatus.active:
            raise InvalidBookingError("phòng đang bảo trì")

        await _expire_stale_holds_for_room(session, room_id)

        conflict = await session.scalar(
            select(BookingNight.id)
            .where(
                BookingNight.room_id == room_id,
                BookingNight.night >= check_in,
                BookingNight.night < check_out,
            )
            .limit(1)
        )
        if conflict is not None:
            raise RoomUnavailableError("phòng đã có người giữ trong khoảng ngày này")

        room_type = await session.get(RoomType, room.room_type_id)
        prop = await session.get(Property, room_type.property_id)

        nights = await quote_nights(session, room.room_type_id, check_in, check_out)
        total = sum((p for _, p in nights), Decimal(0))

        booking = Booking(
            code=_gen_code(),
            org_id=prop.org_id,
            property_id=prop.id,
            room_id=room_id,
            user_id=user_id,
            guest_name=guest_name,
            guest_email=guest_email,
            guest_phone=guest_phone,
            num_guests=num_guests,
            check_in=check_in,
            check_out=check_out,
            status=BookingStatus.pending,
            expires_at=_now() + timedelta(minutes=settings.booking_hold_minutes),
            version=0,
            total_amount=total,
        )
        session.add(booking)
        await session.flush()
        session.add_all(
            [
                BookingNight(booking_id=booking.id, room_id=room_id, night=night, price=price)
                for night, price in nights
            ]
        )
        await session.commit()
    except IntegrityError as exc:
        # Tầng 3: UNIQUE (room_id, night) — race lọt qua check vẫn bị chặn ở đây.
        await session.rollback()
        raise RoomUnavailableError("phòng đã có người giữ trong khoảng ngày này") from exc
    except Exception:
        await session.rollback()
        raise
    return booking


async def _transition(
    session: AsyncSession,
    booking_id: uuid.UUID,
    expected_version: int,
    from_statuses: tuple[BookingStatus, ...],
    to_status: BookingStatus,
    *,
    clear_expiry: bool = False,
    release_nights: bool = False,
) -> Booking:
    """Chuyển trạng thái bằng optimistic lock: UPDATE ... WHERE version khớp."""
    values: dict = {"status": to_status, "version": Booking.version + 1}
    if clear_expiry:
        values["expires_at"] = None
    result = await session.execute(
        update(Booking)
        .where(
            Booking.id == booking_id,
            Booking.version == expected_version,
            Booking.status.in_(from_statuses),
        )
        .values(**values)
        .returning(Booking.id)
    )
    if result.scalar_one_or_none() is None:
        await session.rollback()
        raise StaleVersionError(
            "booking đã bị thay đổi bởi thao tác khác (version/status không khớp)"
        )
    if release_nights:
        await session.execute(delete(BookingNight).where(BookingNight.booking_id == booking_id))
    await session.commit()
    booking = await session.get(Booking, booking_id)
    return booking


async def confirm_booking(
    session: AsyncSession, booking_id: uuid.UUID, expected_version: int
) -> Booking:
    """Tầng 2: pending → confirmed. Phase 3 sẽ gọi từ IPN handler (nguồn sự
    thật duy nhất); hiện expose cho admin/test."""
    return await _transition(
        session,
        booking_id,
        expected_version,
        (BookingStatus.pending,),
        BookingStatus.confirmed,
        clear_expiry=True,
    )


async def cancel_booking(
    session: AsyncSession, booking_id: uuid.UUID, expected_version: int
) -> Booking:
    return await _transition(
        session,
        booking_id,
        expected_version,
        (BookingStatus.pending, BookingStatus.confirmed),
        BookingStatus.cancelled,
        clear_expiry=True,
        release_nights=True,
    )


async def expire_pending_bookings(session: AsyncSession) -> int:
    """Cron mỗi phút (KE_HOACH Phase 2): expire mọi pending quá hạn, nhả phòng.

    Idempotent — gọi nhiều lần vô hại. Trả về số booking đã expire.
    """
    stale_ids = (
        (
            await session.execute(
                select(Booking.id)
                .where(
                    Booking.status == BookingStatus.pending,
                    Booking.expires_at < _now(),
                )
                .with_for_update(skip_locked=True)
            )
        )
        .scalars()
        .all()
    )
    if not stale_ids:
        return 0
    await session.execute(
        update(Booking)
        .where(Booking.id.in_(stale_ids), Booking.status == BookingStatus.pending)
        .values(status=BookingStatus.expired, version=Booking.version + 1)
    )
    await session.execute(delete(BookingNight).where(BookingNight.booking_id.in_(stale_ids)))
    await session.commit()
    return len(stale_ids)


async def get_unavailable_nights(
    session: AsyncSession, room_id: uuid.UUID, date_from: date, date_to: date
) -> list[date]:
    """Calendar query: các đêm đã bị giữ (tính cả pending chưa hết hạn)."""
    rows = await session.execute(
        select(BookingNight.night)
        .join(Booking, Booking.id == BookingNight.booking_id)
        .where(
            BookingNight.room_id == room_id,
            BookingNight.night >= date_from,
            BookingNight.night < date_to,
            Booking.status.in_(HOLDING_STATUSES),
            # pending còn hạn mới tính là giữ phòng
            (Booking.status != BookingStatus.pending) | (Booking.expires_at >= _now()),
        )
        .order_by(BookingNight.night)
    )
    return [r[0] for r in rows.all()]
