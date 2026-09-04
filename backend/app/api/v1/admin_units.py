import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import get_current_user, get_db
from app.models import Property, User
from app.schemas.catalog import PropertyDetailOut, PropertyOut, UnitAdminUpdate

router = APIRouter(prefix="/admin/units", tags=["admin-units"])


@router.get("", response_model=list[PropertyOut])
async def list_units_admin(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[Property]:
    """Admin/Ops: Danh sách 5 căn hộ đang vận hành kèm giá tháng/đêm và trạng thái."""
    query = (
        select(Property)
        .order_by(Property.unit_code.asc().nulls_last(), Property.created_at.asc())
    )
    result = await db.scalars(query)
    return list(result.all())


@router.get("/{property_id}", response_model=PropertyDetailOut)
async def get_unit_admin(
    property_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Property:
    """Admin/Ops: Chi tiết căn hộ."""
    prop = await db.scalar(
        select(Property)
        .options(
            selectinload(Property.room_types),
            selectinload(Property.amenities),
            selectinload(Property.images),
        )
        .where(Property.id == property_id)
    )
    if prop is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Căn hộ không tồn tại")
    return prop


@router.patch("/{property_id}", response_model=PropertyOut)
async def update_unit_admin(
    property_id: uuid.UUID,
    data: UnitAdminUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Property:
    """Admin/Ops: Cập nhật giá thuê tháng/đêm, trạng thái phòng (Trống/Giữ chỗ/Đang ở/Bảo trì) và mô tả."""
    prop = await db.get(Property, property_id)
    if prop is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Căn hộ không tồn tại")

    update_dict = data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(prop, field, value)

    await db.commit()
    await db.refresh(prop)
    return prop
