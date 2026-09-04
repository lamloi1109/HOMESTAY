from datetime import date, datetime
import uuid

from pydantic import BaseModel, ConfigDict, Field

from app.models.inquiry import InquiryChannel, InquiryStage


class InquiryCreate(BaseModel):
    guest_name: str = Field(min_length=1, max_length=255)
    phone: str = Field(min_length=8, max_length=32)
    zalo: str | None = None
    email: str | None = None
    property_id: uuid.UUID | None = None
    unit_code: str | None = None
    checkin_date: date | None = None
    rental_term: str | None = None
    guest_count: int = Field(default=2, ge=1, le=20)
    note: str | None = None
    channel: InquiryChannel = InquiryChannel.web_form


class InquiryUpdateAdmin(BaseModel):
    stage: InquiryStage | None = None
    note: str | None = None
    assigned_to_user_id: uuid.UUID | None = None
    rental_term: str | None = None
    checkin_date: date | None = None


class InquiryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    org_id: uuid.UUID
    property_id: uuid.UUID | None = None
    unit_code: str | None = None
    property_name: str | None = None
    guest_name: str
    phone: str
    zalo: str | None = None
    email: str | None = None
    checkin_date: date | None = None
    rental_term: str | None = None
    guest_count: int
    note: str | None = None
    channel: InquiryChannel
    stage: InquiryStage
    assigned_to_user_id: uuid.UUID | None = None
    created_at: datetime
    updated_at: datetime


class InquirySuccessResponse(BaseModel):
    success: bool = True
    message: str
    inquiry_id: uuid.UUID
