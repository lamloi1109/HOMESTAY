import enum
import uuid
from datetime import date
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import Date, Enum, ForeignKey, Numeric, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPKMixin

if TYPE_CHECKING:
    from app.models.property import Property


class ResidenceStatus(str, enum.Enum):
    registered = "registered"  # Đã đăng ký tạm trú
    pending = "pending"  # Đang chờ xử lý
    expired = "expired"  # Hết hạn tạm trú


class DocumentStatus(str, enum.Enum):
    complete = "complete"  # Đầy đủ giấy tờ (CCCD/Hộ chiếu/Visa)
    missing = "missing"  # Còn thiếu hồ sơ


class Lease(UUIDPKMixin, TimestampMixin, Base):
    """Hợp đồng và thông tin khách thuê thực tế."""

    __tablename__ = "leases"

    org_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False
    )
    property_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("properties.id", ondelete="CASCADE"), nullable=False
    )
    guest_name: Mapped[str] = mapped_column(String(255), nullable=False)
    nationality: Mapped[str] = mapped_column(String(120), default="Việt Nam", nullable=False)
    phone: Mapped[str | None] = mapped_column(String(32), nullable=True)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    monthly_rent: Mapped[Decimal] = mapped_column(Numeric(12, 0), nullable=False)
    residence_status: Mapped[ResidenceStatus] = mapped_column(
        Enum(ResidenceStatus, name="residence_status"),
        default=ResidenceStatus.pending,
        nullable=False,
    )
    document_status: Mapped[DocumentStatus] = mapped_column(
        Enum(DocumentStatus, name="document_status"),
        default=DocumentStatus.complete,
        nullable=False,
    )
    note: Mapped[str | None] = mapped_column(Text, nullable=True)

    property: Mapped["Property"] = relationship(lazy="joined")
