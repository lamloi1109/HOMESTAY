import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.models import Organization, TourService, User
from app.schemas.service import TourServiceCreate, TourServiceOut, TourServiceUpdate

router = APIRouter(prefix="/admin/services", tags=["admin-services"])


@router.get("", response_model=list[TourServiceOut])
async def list_services_admin(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[TourService]:
    """Admin/Ops: Danh sách tất cả dịch vụ du lịch & tiện ích (kể cả inactive)."""
    query = select(TourService).order_by(TourService.sort_order.asc(), TourService.created_at.asc())
    result = await db.scalars(query)
    return list(result.all())


@router.post("", response_model=TourServiceOut, status_code=status.HTTP_201_CREATED)
async def create_service_admin(
    data: TourServiceCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> TourService:
    """Admin/Ops: Thêm mới dịch vụ du lịch / tiện ích đi kèm."""
    org = await db.scalar(select(Organization).where(Organization.slug == "gaoji-house"))
    if org is None:
        org = await db.scalar(select(Organization).limit(1))
    if org is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Tổ chức chưa tồn tại")

    svc = TourService(org_id=org.id, **data.model_dump())
    db.add(svc)
    await db.commit()
    await db.refresh(svc)
    return svc


@router.patch("/{service_id}", response_model=TourServiceOut)
async def update_service_admin(
    service_id: uuid.UUID,
    data: TourServiceUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> TourService:
    """Admin/Ops: Cập nhật dịch vụ (giá, tên, trạng thái bật/tắt)."""
    svc = await db.get(TourService, service_id)
    if svc is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dịch vụ không tồn tại")

    update_dict = data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(svc, field, value)

    await db.commit()
    await db.refresh(svc)
    return svc


@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_service_admin(
    service_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    """Admin/Ops: Xóa dịch vụ."""
    svc = await db.get(TourService, service_id)
    if svc is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dịch vụ không tồn tại")

    await db.delete(svc)
    await db.commit()
