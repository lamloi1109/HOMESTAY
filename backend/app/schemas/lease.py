from datetime import date, datetime
from decimal import Decimal
import uuid

from pydantic import BaseModel, ConfigDict, Field

from app.models.lease import DocumentStatus, ResidenceStatus


class LeaseCreate(BaseModel):
    property_id: uuid.UUID
    guest_name: str = Field(min_length=1, max_length=255)
    nationality: str = Field(default="Việt Nam", max_length=120)
    phone: str | None = Field(default=None, max_length=32)
    start_date: date
    end_date: date
    monthly_rent: Decimal = Field(gt=0)
    residence_status: ResidenceStatus = ResidenceStatus.pending
    document_status: DocumentStatus = DocumentStatus.complete
    note: str | None = None


class LeaseUpdate(BaseModel):
    guest_name: str | None = None
    nationality: str | None = None
    phone: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    monthly_rent: Decimal | None = None
    residence_status: ResidenceStatus | None = None
    document_status: DocumentStatus | None = None
    note: str | None = None


class LeaseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    org_id: uuid.UUID
    property_id: uuid.UUID
    unit_code: str | None = None
    property_name: str | None = None
    guest_name: str
    nationality: str
    phone: str | None = None
    start_date: date
    end_date: date
    days_remaining: int | None = None
    monthly_rent: Decimal
    residence_status: ResidenceStatus
    document_status: DocumentStatus
    note: str | None = None
    created_at: datetime
    updated_at: datetime
