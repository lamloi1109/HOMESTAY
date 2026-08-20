import enum
import uuid
from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import Date, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPKMixin

if TYPE_CHECKING:
    from app.models.property import Property


class InquiryChannel(str, enum.Enum):
    zalo = "zalo"
    phone = "phone"
    web_form = "web_form"
    wechat = "wechat"
    email = "email"


class InquiryStage(str, enum.Enum):
    new = "new"  # Mới tiếp nhận
    talking = "talking"  # Đang tư vấn
    hold = "hold"  # Giữ chỗ
    won = "won"  # Đã chốt
    lost = "lost"  # Không thành


class Inquiry(UUIDPKMixin, TimestampMixin, Base):
    """Yêu cầu tư vấn / Khách hàng tiềm năng (Lead) cho Gaoji House."""

    __tablename__ = "inquiries"

    org_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False
    )
    property_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("properties.id", ondelete="SET NULL"), nullable=True
    )
    guest_name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str] = mapped_column(String(32), nullable=False)
    zalo: Mapped[str | None] = mapped_column(String(64), nullable=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    checkin_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    rental_term: Mapped[str | None] = mapped_column(
        String(64), nullable=True
    )  # e.g. "Theo đêm", "1-3 tháng", "Dài hạn >= 6 tháng"
    guest_count: Mapped[int] = mapped_column(Integer, default=2, nullable=False)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)
    channel: Mapped[InquiryChannel] = mapped_column(
        Enum(InquiryChannel, name="inquiry_channel"),
        default=InquiryChannel.web_form,
        nullable=False,
    )
    stage: Mapped[InquiryStage] = mapped_column(
        Enum(InquiryStage, name="inquiry_stage"),
        default=InquiryStage.new,
        nullable=False,
    )
    assigned_to_user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )

    property: Mapped["Property | None"] = relationship(lazy="joined")
