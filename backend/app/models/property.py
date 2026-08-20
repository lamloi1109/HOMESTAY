import enum
import uuid
from decimal import Decimal

from sqlalchemy import JSON, Enum, ForeignKey, Integer, Numeric, String, Text, UniqueConstraint
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
    unit_code: Mapped[str | None] = mapped_column(String(64), unique=True, nullable=True)
    tower: Mapped[str | None] = mapped_column(String(64), nullable=True)  # e.g. "Landmark 1", "Park 1"
    floor: Mapped[str | None] = mapped_column(String(64), nullable=True)  # e.g. "Tầng 29"
    view_type: Mapped[str | None] = mapped_column(String(120), nullable=True)  # e.g. "Sông Sài Gòn"
    price_monthly: Mapped[Decimal | None] = mapped_column(Numeric(12, 0), nullable=True)
    price_nightly: Mapped[Decimal | None] = mapped_column(Numeric(12, 0), nullable=True)
    sqm: Mapped[int | None] = mapped_column(Integer, nullable=True)
    bedrooms: Mapped[int | None] = mapped_column(Integer, default=1, nullable=True)
    bathrooms: Mapped[int | None] = mapped_column(Integer, default=1, nullable=True)
    max_guests: Mapped[int | None] = mapped_column(Integer, default=2, nullable=True)
    room_layout: Mapped[dict | list | None] = mapped_column(JSON, nullable=True)
    operational_status: Mapped[str | None] = mapped_column(
        String(64), default="available", nullable=True
    )  # available, held, occupied, maintenance
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
    images: Mapped[list["PropertyImage"]] = relationship(
        back_populates="property", order_by="PropertyImage.sort_order"
    )


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


class PropertyImage(UUIDPKMixin, TimestampMixin, Base):
    """Ảnh property — file lưu qua StorageService (MVP: local disk, Phase sau
    swap S3-compatible không đổi bảng). `stored_name` là tên file đã sinh
    (uuid.ext), URL public = /uploads/{stored_name}.
    """

    __tablename__ = "property_images"
    __table_args__ = (UniqueConstraint("stored_name", name="uq_property_image_file"),)

    property_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("properties.id", ondelete="CASCADE"), nullable=False
    )
    stored_name: Mapped[str] = mapped_column(String(128), nullable=False)
    original_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    alt: Mapped[str | None] = mapped_column(String(255), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    property: Mapped[Property] = relationship(back_populates="images")


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
