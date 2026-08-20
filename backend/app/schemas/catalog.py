import uuid
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.models.property import PropertyStatus, RoomStatus


class OrgCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    slug: str = Field(min_length=1, max_length=255, pattern=r"^[a-z0-9-]+$")


class OrgOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    slug: str


class PropertyCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    slug: str = Field(min_length=1, max_length=255, pattern=r"^[a-z0-9-]+$")
    description: str | None = None
    address: str | None = Field(default=None, max_length=500)
    city: str | None = Field(default=None, max_length=120)


class AmenityOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    code: str
    name: str
    icon: str | None
    group_name: str


class PropertyOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    org_id: uuid.UUID
    name: str
    slug: str
    unit_code: str | None = None
    tower: str | None = None
    floor: str | None = None
    view_type: str | None = None
    price_monthly: Decimal | None = None
    price_nightly: Decimal | None = None
    sqm: int | None = None
    bedrooms: int | None = 1
    bathrooms: int | None = 1
    max_guests: int | None = 2
    room_layout: list[dict] | dict | None = None
    operational_status: str | None = "available"
    description: str | None = None
    address: str | None = None
    city: str | None = None
    status: PropertyStatus


class UnitAdminUpdate(BaseModel):
    price_monthly: Decimal | None = None
    price_nightly: Decimal | None = None
    operational_status: str | None = None  # available, held, occupied, maintenance
    description: str | None = None
    status: PropertyStatus | None = None
    view_type: str | None = None
    sqm: int | None = None
    bedrooms: int | None = None
    bathrooms: int | None = None
    max_guests: int | None = None
    room_layout: list[dict] | dict | None = None


class RoomTypeCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = None
    base_price: Decimal = Field(gt=0)
    capacity_adults: int = Field(default=2, ge=1, le=20)
    capacity_children: int = Field(default=0, ge=0, le=20)


class RoomTypeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    property_id: uuid.UUID
    name: str
    description: str | None
    base_price: Decimal
    capacity_adults: int
    capacity_children: int


class RoomCreate(BaseModel):
    code: str = Field(min_length=1, max_length=64)


class RoomOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    room_type_id: uuid.UUID
    code: str
    status: RoomStatus


class RoomTypeDetailOut(RoomTypeOut):
    rooms: list[RoomOut] = []


class PropertyImageOut(BaseModel):
    id: uuid.UUID
    url: str
    alt: str | None
    sort_order: int


class PropertyListItemOut(PropertyOut):
    cover_image: str | None = None


class PropertyDetailOut(PropertyOut):
    room_types: list[RoomTypeDetailOut] = []
    amenities: list[AmenityOut] = []
    images: list[PropertyImageOut] = []


class SetAmenitiesRequest(BaseModel):
    amenity_codes: list[str]
