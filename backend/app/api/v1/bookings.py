import uuid
from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import (
    ensure_permission,
    get_current_user,
    get_db,
    get_optional_user,
)
from app.core.permissions import Perm
from app.models import Booking, BookingStatus, User
from app.schemas.booking import (
    AvailabilityOut,
    BookingCreate,
    BookingOut,
    BookingTransition,
    ExpireResult,
)
from app.services import booking as booking_service

router = APIRouter(tags=["bookings"])


@router.post("/bookings", response_model=BookingOut, status_code=status.HTTP_201_CREATED)
async def create_booking(
    body: BookingCreate,
    user: User | None = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
) -> Booking:
    """Soft-hold: giữ phòng 15 phút chờ thanh toán. Không cần đăng nhập (guest checkout)."""
    try:
        return await booking_service.create_booking(
            db,
            room_id=body.room_id,
            check_in=body.check_in,
            check_out=body.check_out,
            guest_name=body.guest_name,
            guest_email=body.guest_email,
            guest_phone=body.guest_phone,
            num_guests=body.num_guests,
            user_id=user.id if user else None,
            note=body.note,
        )
    except booking_service.RoomUnavailableError as exc:
        raise HTTPException(status.HTTP_409_CONFLICT, str(exc)) from exc
    except booking_service.InvalidBookingError as exc:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, str(exc)) from exc


@router.get("/bookings/{code}", response_model=BookingOut)
async def get_booking_by_code(code: str, db: AsyncSession = Depends(get_db)) -> Booking:
    booking = await db.scalar(select(Booking).where(Booking.code == code.upper()))
    if booking is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Không tìm thấy booking")
    return booking


async def _get_booking_or_404(db: AsyncSession, booking_id: uuid.UUID) -> Booking:
    booking = await db.get(Booking, booking_id)
    if booking is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Không tìm thấy booking")
    return booking


@router.post("/bookings/{booking_id}/confirm", response_model=BookingOut)
async def confirm_booking(
    booking_id: uuid.UUID,
    body: BookingTransition,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Booking:
    """Xác nhận thủ công (lễ tân thu tiền mặt). Phase 3: IPN thanh toán là
    nguồn sự thật cho confirm online — sẽ gọi cùng service này."""
    booking = await _get_booking_or_404(db, booking_id)
    await ensure_permission(db, user, booking.org_id, Perm.BOOKING_WRITE)
    try:
        return await booking_service.confirm_booking(db, booking_id, body.version)
    except booking_service.StaleVersionError as exc:
        raise HTTPException(status.HTTP_409_CONFLICT, str(exc)) from exc


@router.post("/bookings/{booking_id}/cancel", response_model=BookingOut)
async def cancel_booking(
    booking_id: uuid.UUID,
    body: BookingTransition,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Booking:
    """Khách hủy booking của chính mình, hoặc staff/owner hủy trong org."""
    booking = await _get_booking_or_404(db, booking_id)
    if booking.user_id != user.id:
        await ensure_permission(db, user, booking.org_id, Perm.BOOKING_WRITE)
    try:
        return await booking_service.cancel_booking(db, booking_id, body.version)
    except booking_service.StaleVersionError as exc:
        raise HTTPException(status.HTTP_409_CONFLICT, str(exc)) from exc


@router.get("/orgs/{org_id}/bookings", response_model=list[BookingOut])
async def list_org_bookings(
    org_id: uuid.UUID,
    booking_status: BookingStatus | None = Query(default=None, alias="status"),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[Booking]:
    await ensure_permission(db, user, org_id, Perm.BOOKING_READ)
    stmt = select(Booking).where(Booking.org_id == org_id).order_by(Booking.created_at.desc())
    if booking_status is not None:
        stmt = stmt.where(Booking.status == booking_status)
    result = await db.execute(stmt.limit(200))
    return list(result.scalars().all())


@router.get("/rooms/{room_id}/availability", response_model=AvailabilityOut)
async def room_availability(
    room_id: uuid.UUID,
    date_from: date = Query(alias="from"),
    date_to: date = Query(alias="to"),
    db: AsyncSession = Depends(get_db),
) -> AvailabilityOut:
    nights = await booking_service.get_unavailable_nights(db, room_id, date_from, date_to)
    return AvailabilityOut(
        room_id=room_id, date_from=date_from, date_to=date_to, unavailable_nights=nights
    )


@router.post("/internal/expire-bookings", response_model=ExpireResult)
async def expire_bookings(db: AsyncSession = Depends(get_db)) -> ExpireResult:
    """Cron mỗi phút gọi endpoint này (idempotent). MVP: scheduled task /
    Windows Task Scheduler / cron container đều được."""
    expired = await booking_service.expire_pending_bookings(db)
    return ExpireResult(expired=expired)
