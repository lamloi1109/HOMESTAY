import uuid
from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models import BookingStatus


class BookingCreate(BaseModel):
    room_id: uuid.UUID
    check_in: date
    check_out: date
    guest_name: str = Field(min_length=1, max_length=255)
    guest_email: EmailStr
    guest_phone: str | None = Field(default=None, max_length=32)
    num_guests: int = Field(default=1, ge=1, le=40)
    note: str | None = Field(default=None, max_length=1000)


class BookingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    code: str
    org_id: uuid.UUID
    property_id: uuid.UUID
    room_id: uuid.UUID
    guest_name: str
    guest_email: str
    check_in: date
    check_out: date
    num_guests: int
    status: BookingStatus
    expires_at: datetime | None
    version: int
    total_amount: Decimal
    currency: str


class BookingTransition(BaseModel):
    """Client phải gửi version đã đọc — optimistic lock chống ghi đè."""

    version: int = Field(ge=0)


class AvailabilityOut(BaseModel):
    room_id: uuid.UUID
    date_from: date
    date_to: date
    unavailable_nights: list[date]


class ExpireResult(BaseModel):
    expired: int
