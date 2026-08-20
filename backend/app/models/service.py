import uuid
from decimal import Decimal

from sqlalchemy import Boolean, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDPKMixin


class TourService(UUIDPKMixin, TimestampMixin, Base):
    """Danh mục dịch vụ du lịch & tiện ích cư trú bổ sung."""

    __tablename__ = "tour_services"

    org_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(
        String(120), nullable=False
    )  # "Di chuyển", "Dịch vụ phòng", "Trải nghiệm", "Tiện ích"
    price: Mapped[Decimal] = mapped_column(Numeric(12, 0), nullable=False)
    price_unit: Mapped[str] = mapped_column(
        String(64), default="lần", nullable=False
    )  # "chuyến", "lần", "ngày", "tháng"
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    icon: Mapped[str | None] = mapped_column(
        String(64), nullable=True
    )  # Lucide icon name, e.g. "car", "sparkles", "compass"
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
