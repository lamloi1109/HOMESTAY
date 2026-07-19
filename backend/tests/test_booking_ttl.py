"""Tempering Phase 2: booking pending quá TTL 15 phút tự expire, nhả phòng."""

from datetime import date, datetime, timedelta, timezone

from sqlalchemy import select, update

from app.models import Booking, BookingNight, BookingStatus
from app.services.booking import (
    StaleVersionError,
    confirm_booking,
    create_booking,
    expire_pending_bookings,
    get_unavailable_nights,
)

TOMORROW = date.today() + timedelta(days=1)


async def _make_pending(session, room_id) -> Booking:
    return await create_booking(
        session,
        room_id=room_id,
        check_in=TOMORROW,
        check_out=TOMORROW + timedelta(days=1),
        guest_name="TTL Guest",
        guest_email="ttl@example.com",
    )


async def _force_expire_time(session, booking_id) -> None:
    await session.execute(
        update(Booking)
        .where(Booking.id == booking_id)
        .values(expires_at=datetime.now(timezone.utc) - timedelta(minutes=1))
    )
    await session.commit()


async def test_pending_expires_and_releases_room(db, demo_room):
    booking = await _make_pending(db, demo_room.id)
    assert booking.status == BookingStatus.pending
    assert booking.expires_at is not None

    # Phòng đang bị giữ
    held = await get_unavailable_nights(db, demo_room.id, TOMORROW, TOMORROW + timedelta(days=1))
    assert held == [TOMORROW]

    await _force_expire_time(db, booking.id)
    expired_count = await expire_pending_bookings(db)
    assert expired_count == 1

    refreshed = await db.get(Booking, booking.id)
    await db.refresh(refreshed)
    assert refreshed.status == BookingStatus.expired

    # Nights đã xóa → calendar nhả ngày
    nights = (
        (await db.execute(select(BookingNight).where(BookingNight.booking_id == booking.id)))
        .scalars()
        .all()
    )
    assert nights == []

    # Khách mới đặt lại được ngay
    rebooked = await _make_pending(db, demo_room.id)
    assert rebooked.status == BookingStatus.pending


async def test_expire_is_idempotent(db, demo_room):
    booking = await _make_pending(db, demo_room.id)
    await _force_expire_time(db, booking.id)
    assert await expire_pending_bookings(db) == 1
    assert await expire_pending_bookings(db) == 0


async def test_expired_booking_cannot_be_confirmed(db, demo_room):
    """IPN về muộn sau khi hold đã expire → confirm phải fail (version/status check)."""
    booking = await _make_pending(db, demo_room.id)
    version_client_read = booking.version
    await _force_expire_time(db, booking.id)
    await expire_pending_bookings(db)

    try:
        await confirm_booking(db, booking.id, version_client_read)
        raise AssertionError("confirm booking đã expired phải raise StaleVersionError")
    except StaleVersionError:
        pass


async def test_optimistic_version_blocks_double_confirm(db, demo_room):
    booking = await _make_pending(db, demo_room.id)
    confirmed = await confirm_booking(db, booking.id, booking.version)
    assert confirmed.status == BookingStatus.confirmed

    try:
        await confirm_booking(db, booking.id, booking.version)
        raise AssertionError("double confirm với version cũ phải fail")
    except StaleVersionError:
        pass
