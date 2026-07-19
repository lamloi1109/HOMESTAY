import enum
import uuid
from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import (
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPKMixin


class BookingStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    checked_in = "checked_in"
    checked_out = "checked_out"
    cancelled = "cancelled"
    expired = "expired"


class Booking(UUIDPKMixin, TimestampMixin, Base):
    """Soft-hold 2 tầng (KE_HOACH Phase 2):

    - Tầng 1: tạo `pending` + `expires_at = now() + 15'` trong transaction có
      `SELECT ... FOR UPDATE` trên row room → phòng ẩn ngay với khách khác.
    - Tầng 2: IPN thanh toán chuyển `pending → confirmed` bằng optimistic
      `version` (UPDATE ... WHERE version = :expected).
    - Cron mỗi phút expire pending quá hạn, xóa booking_nights → nhả phòng.
    """

    __tablename__ = "bookings"
    __table_args__ = (
        # Cron expire quét theo (status, expires_at).
        Index("ix_bookings_status_expires", "status", "expires_at"),
        Index("ix_bookings_org", "org_id"),
    )

    code: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    org_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="RESTRICT"), nullable=False
    )
    property_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("properties.id", ondelete="RESTRICT"), nullable=False
    )
    room_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("rooms.id", ondelete="RESTRICT"), nullable=False
    )
    # Nullable — guest checkout không cần tài khoản (Phase 4).
    user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )

    guest_name: Mapped[str] = mapped_column(String(255), nullable=False)
    guest_email: Mapped[str] = mapped_column(String(320), nullable=False)
    guest_phone: Mapped[str | None] = mapped_column(String(32), nullable=True)
    num_guests: Mapped[int] = mapped_column(Integer, default=1, nullable=False)

    check_in: Mapped[date] = mapped_column(Date, nullable=False)
    check_out: Mapped[date] = mapped_column(Date, nullable=False)

    status: Mapped[BookingStatus] = mapped_column(
        Enum(BookingStatus, name="booking_status"),
        default=BookingStatus.pending,
        nullable=False,
    )
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    # Optimistic lock — mọi chuyển trạng thái phải WHERE version = :expected.
    version: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    total_amount: Mapped[Decimal] = mapped_column(Numeric(12, 0), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="VND", nullable=False)
    note: Mapped[str | None] = mapped_column(String(1000), nullable=True)

    nights: Mapped[list["BookingNight"]] = relationship(
        back_populates="booking", cascade="all, delete-orphan"
    )


class BookingNight(Base):
    """1 row = 1 phòng-đêm đã giữ. UNIQUE (room_id, night) là tầng chống
    double-booking cuối cùng ở mức DB — kể cả khi logic lock có bug thì
    constraint này vẫn chặn 2 booking active trùng đêm.

    Row chỉ tồn tại khi booking đang giữ phòng (pending chưa hết hạn /
    confirmed / checked_in). Expire/cancel → xóa row → nhả phòng.
    """

    __tablename__ = "booking_nights"
    __table_args__ = (
        UniqueConstraint("room_id", "night", name="uq_room_night"),
        Index("ix_booking_nights_booking", "booking_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    booking_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False
    )
    room_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("rooms.id", ondelete="RESTRICT"), nullable=False
    )
    night: Mapped[date] = mapped_column(Date, nullable=False)
    price: Mapped[Decimal] = mapped_column(Numeric(12, 0), nullable=False)

    booking: Mapped[Booking] = relationship(back_populates="nights")


class PriceRule(UUIDPKMixin, TimestampMixin, Base):
    """Giá theo mùa đơn giản (KE_HOACH Phase 2): rule theo range ngày +
    weekday mask. Rule priority cao nhất khớp sẽ thắng; không khớp rule nào
    → base_price của room_type. Dynamic pricing thuật toán để Phase 7+.
    """

    __tablename__ = "price_rules"
    __table_args__ = (Index("ix_price_rules_room_type", "room_type_id"),)

    room_type_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("room_types.id", ondelete="CASCADE"), nullable=False
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    date_start: Mapped[date | None] = mapped_column(Date, nullable=True)
    date_end: Mapped[date | None] = mapped_column(Date, nullable=True)
    # Bitmask thứ trong tuần: bit 0 = Monday ... bit 6 = Sunday. NULL = mọi thứ.
    weekday_mask: Mapped[int | None] = mapped_column(Integer, nullable=True)
    price: Mapped[Decimal] = mapped_column(Numeric(12, 0), nullable=False)
    priority: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
