from datetime import datetime
from decimal import Decimal
import uuid

from pydantic import BaseModel, ConfigDict, Field


class TourServiceCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    category: str = Field(min_length=1, max_length=120)
    price: Decimal = Field(ge=0)
    price_unit: str = Field(default="lần", max_length=64)
    description: str | None = None
    icon: str | None = None
    is_active: bool = True
    sort_order: int = 0


class TourServiceUpdate(BaseModel):
    name: str | None = None
    category: str | None = None
    price: Decimal | None = None
    price_unit: str | None = None
    description: str | None = None
    icon: str | None = None
    is_active: bool | None = None
    sort_order: int | None = None


class TourServiceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    org_id: uuid.UUID
    name: str
    category: str
    price: Decimal
    price_unit: str
    description: str | None = None
    icon: str | None = None
    is_active: bool
    sort_order: int
    created_at: datetime
    updated_at: datetime
