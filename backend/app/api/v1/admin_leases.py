from datetime import date
import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import get_current_user, get_db
from app.models import Lease, Property, User
from app.schemas.lease import LeaseCreate, LeaseOut, LeaseUpdate

router = APIRouter(prefix="/admin/leases", tags=["admin-leases"])


@router.get("", response_model=list[LeaseOut])
async def list_leases_admin(
    expiring_days: int | None = Query(default=None, description="Lọc hợp đồng hết hạn trong N ngày (ví dụ 30)"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[LeaseOut]:
    """Admin/Ops: Danh sách hợp đồng khách thuê & cảnh báo gia hạn/tạm trú."""
    today = date.today()
    query = select(Lease).options(selectinload(Lease.property)).order_by(Lease.end_date.asc())

    leases = (await db.scalars(query)).all()
    results: list[LeaseOut] = []

    for lease_obj in leases:
        days_rem = (lease_obj.end_date - today).days
        if expiring_days is not None and (days_rem < 0 or days_rem > expiring_days):
            continue

        results.append(
            LeaseOut(
                id=lease_obj.id,
                org_id=lease_obj.org_id,
                property_id=lease_obj.property_id,
                unit_code=lease_obj.property.unit_code if lease_obj.property else None,
                property_name=lease_obj.property.name if lease_obj.property else None,
                guest_name=lease_obj.guest_name,
                nationality=lease_obj.nationality,
                phone=lease_obj.phone,
                start_date=lease_obj.start_date,
                end_date=lease_obj.end_date,
                days_remaining=days_rem,
                monthly_rent=lease_obj.monthly_rent,
                residence_status=lease_obj.residence_status,
                document_status=lease_obj.document_status,
                note=lease_obj.note,
                created_at=lease_obj.created_at,
                updated_at=lease_obj.updated_at,
            )
        )

    return results


@router.post("", response_model=LeaseOut, status_code=status.HTTP_201_CREATED)
async def create_lease_admin(
    data: LeaseCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> LeaseOut:
    """Admin/Ops: Tạo hợp đồng khách thuê mới."""
    prop = await db.get(Property, data.property_id)
    if prop is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Căn hộ không tồn tại")

    lease = Lease(org_id=prop.org_id, **data.model_dump())
    db.add(lease)
    await db.commit()
    await db.refresh(lease)

    days_rem = (lease.end_date - date.today()).days
    return LeaseOut(
        id=lease.id,
        org_id=lease.org_id,
        property_id=lease.property_id,
        unit_code=prop.unit_code,
        property_name=prop.name,
        guest_name=lease.guest_name,
        nationality=lease.nationality,
        phone=lease.phone,
        start_date=lease.start_date,
        end_date=lease.end_date,
        days_remaining=days_rem,
        monthly_rent=lease.monthly_rent,
        residence_status=lease.residence_status,
        document_status=lease.document_status,
        note=lease.note,
        created_at=lease.created_at,
        updated_at=lease.updated_at,
    )


@router.patch("/{lease_id}", response_model=LeaseOut)
async def update_lease_admin(
    lease_id: uuid.UUID,
    data: LeaseUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> LeaseOut:
    """Admin/Ops: Cập nhật hợp đồng (tạm trú, hồ sơ, ngày gia hạn)."""
    lease = await db.scalar(
        select(Lease).options(selectinload(Lease.property)).where(Lease.id == lease_id)
    )
    if lease is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hợp đồng không tồn tại")

    update_dict = data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(lease, field, value)

    await db.commit()
    await db.refresh(lease)

    days_rem = (lease.end_date - date.today()).days
    return LeaseOut(
        id=lease.id,
        org_id=lease.org_id,
        property_id=lease.property_id,
        unit_code=lease.property.unit_code if lease.property else None,
        property_name=lease.property.name if lease.property else None,
        guest_name=lease.guest_name,
        nationality=lease.nationality,
        phone=lease.phone,
        start_date=lease.start_date,
        end_date=lease.end_date,
        days_remaining=days_rem,
        monthly_rent=lease.monthly_rent,
        residence_status=lease.residence_status,
        document_status=lease.document_status,
        note=lease.note,
        created_at=lease.created_at,
        updated_at=lease.updated_at,
    )
