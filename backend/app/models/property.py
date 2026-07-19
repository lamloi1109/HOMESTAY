import enum
import uuid
from decimal import Decimal

from sqlalchemy import Enum, ForeignKey, Integer, Numeric, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPKMixin


class PropertyStatus(str, enum.Enum):
    draft = "draft"
    active = "active"
    inactive = "inactive"


class Property(UUIDPKMixin, TimestampMixin, Base):
    __tablename__ = "properties"
    __table_args__ = (UniqueConstraint("org_id", "slug", name="uq_property_org_slug"),)

    org_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    address: Mapped[str | None] = mapped_column(String(500), nullable=True)
    city: Mapped[str | None] = mapped_column(String(120), nullable=True)
    status: Mapped[PropertyStatus] = mapped_column(
        Enum(PropertyStatus, name="property_status"),
        default=PropertyStatus.draft,
        nullable=False,
    )

    room_types: Mapped[list["RoomType"]] = relationship(back_populates="property")
    amenities: Mapped[list["PropertyAmenity"]] = relationship(back_populates="property")


class RoomType(UUIDPKMixin, TimestampMixin, Base):
    __tablename__ = "room_types"

    property_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("properties.id", ondelete="CASCADE"), nullable=False
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    # VND — không dùng float cho tiền, Numeric(12,0) đủ tới 999 tỷ.
    base_price: Mapped[Decimal] = mapped_column(Numeric(12, 0), nullable=False)
    capacity_adults: Mapped[int] = mapped_column(Integer, default=2, nullable=False)
    capacity_children: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    property: Mapped[Property] = relationship(back_populates="room_types")
    rooms: Mapped[list["Room"]] = relationship(back_populates="room_type")


class RoomStatus(str, enum.Enum):
    active = "active"
    maintenance = "maintenance"


class Room(UUIDPKMixin, TimestampMixin, Base):
    """Đơn vị bán — row bị SELECT ... FOR UPDATE khi tạo booking (serialize theo phòng)."""

    __tablename__ = "rooms"
    __table_args__ = (UniqueConstraint("room_type_id", "code", name="uq_room_code"),)

    room_type_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("room_types.id", ondelete="CASCADE"), nullable=False
    )
    code: Mapped[str] = mapped_column(String(64), nullable=False)
    status: Mapped[RoomStatus] = mapped_column(
        Enum(RoomStatus, name="room_status"), default=RoomStatus.active, nullable=False
    )

    room_type: Mapped[RoomType] = relationship(back_populates="rooms")


class Amenity(UUIDPKMixin, TimestampMixin, Base):
    """Danh mục tiện ích chuẩn hóa (PRD Phase 1) — không free-text để giữ filter Phase 4."""

    __tablename__ = "amenities"

    code: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    icon: Mapped[str | None] = mapped_column(String(64), nullable=True)
    group_name: Mapped[str] = mapped_column(String(120), nullable=False)


class PropertyAmenity(UUIDPKMixin, TimestampMixin, Base):
    __tablename__ = "property_amenities"
    __table_args__ = (UniqueConstraint("property_id", "amenity_id", name="uq_property_amenity"),)

    property_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("properties.id", ondelete="CASCADE"), nullable=False
    )
    amenity_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("amenities.id", ondelete="CASCADE"), nullable=False
    )

    property: Mapped[Property] = relationship(back_populates="amenities")
    amenity: Mapped[Amenity] = relationship(lazy="joined")
