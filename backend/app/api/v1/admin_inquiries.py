from datetime import datetime, timezone
import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import get_current_user, get_db
from app.models import Inquiry, InquiryChannel, InquiryStage, User
from app.schemas.inquiry import InquiryOut, InquiryUpdateAdmin

router = APIRouter(prefix="/admin/inquiries", tags=["admin-inquiries"])


@router.get("", response_model=list[InquiryOut])
async def list_inquiries_admin(
    stage: InquiryStage | None = None,
    channel: InquiryChannel | None = None,
    search: str | None = Query(default=None, description="Tìm theo tên khách, sđt, email, mã căn"),
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[InquiryOut]:
    """Admin/Ops: Danh sách yêu cầu tư vấn / Leads (CRM Inbox)."""
    query = select(Inquiry).options(selectinload(Inquiry.property)).order_by(Inquiry.created_at.desc())

    if stage:
        query = query.where(Inquiry.stage == stage)
    if channel:
        query = query.where(Inquiry.channel == channel)
    if search:
        s = f"%{search.strip()}%"
        query = query.where(
            or_(
                Inquiry.guest_name.ilike(s),
                Inquiry.phone.ilike(s),
                Inquiry.zalo.ilike(s),
                Inquiry.email.ilike(s),
            )
        )

    query = query.limit(limit).offset(offset)
    inquiries = (await db.scalars(query)).all()

    return [
        InquiryOut(
            id=i.id,
            org_id=i.org_id,
            property_id=i.property_id,
            unit_code=i.property.unit_code if i.property else None,
            property_name=i.property.name if i.property else None,
            guest_name=i.guest_name,
            phone=i.phone,
            zalo=i.zalo,
            email=i.email,
            checkin_date=i.checkin_date,
            rental_term=i.rental_term,
            guest_count=i.guest_count,
            note=i.note,
            channel=i.channel,
            stage=i.stage,
            assigned_to_user_id=i.assigned_to_user_id,
            created_at=i.created_at,
            updated_at=i.updated_at,
        )
        for i in inquiries
    ]


@router.get("/{inquiry_id}", response_model=InquiryOut)
async def get_inquiry_detail_admin(
    inquiry_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> InquiryOut:
    """Admin/Ops: Chi tiết một yêu cầu tư vấn."""
    inquiry = await db.scalar(
        select(Inquiry).options(selectinload(Inquiry.property)).where(Inquiry.id == inquiry_id)
    )
    if inquiry is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy yêu cầu tư vấn")

    return InquiryOut(
        id=inquiry.id,
        org_id=inquiry.org_id,
        property_id=inquiry.property_id,
        unit_code=inquiry.property.unit_code if inquiry.property else None,
        property_name=inquiry.property.name if inquiry.property else None,
        guest_name=inquiry.guest_name,
        phone=inquiry.phone,
        zalo=inquiry.zalo,
        email=inquiry.email,
        checkin_date=inquiry.checkin_date,
        rental_term=inquiry.rental_term,
        guest_count=inquiry.guest_count,
        note=inquiry.note,
        channel=inquiry.channel,
        stage=inquiry.stage,
        assigned_to_user_id=inquiry.assigned_to_user_id,
        created_at=inquiry.created_at,
        updated_at=inquiry.updated_at,
    )


@router.patch("/{inquiry_id}", response_model=InquiryOut)
async def update_inquiry_admin(
    inquiry_id: uuid.UUID,
    data: InquiryUpdateAdmin,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> InquiryOut:
    """Admin/Ops: Chuyển trạng thái Lead (Mới, Đang tư vấn, Giữ chỗ, Đã chốt, Không thành) và ghi chú."""
    inquiry = await db.scalar(
        select(Inquiry).options(selectinload(Inquiry.property)).where(Inquiry.id == inquiry_id)
    )
    if inquiry is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy yêu cầu tư vấn")

    if data.stage is not None:
        inquiry.stage = data.stage
    if data.note is not None:
        inquiry.note = data.note
    if data.assigned_to_user_id is not None:
        inquiry.assigned_to_user_id = data.assigned_to_user_id
    if data.rental_term is not None:
        inquiry.rental_term = data.rental_term
    if data.checkin_date is not None:
        inquiry.checkin_date = data.checkin_date

    inquiry.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(inquiry)

    return InquiryOut(
        id=inquiry.id,
        org_id=inquiry.org_id,
        property_id=inquiry.property_id,
        unit_code=inquiry.property.unit_code if inquiry.property else None,
        property_name=inquiry.property.name if inquiry.property else None,
        guest_name=inquiry.guest_name,
        phone=inquiry.phone,
        zalo=inquiry.zalo,
        email=inquiry.email,
        checkin_date=inquiry.checkin_date,
        rental_term=inquiry.rental_term,
        guest_count=inquiry.guest_count,
        note=inquiry.note,
        channel=inquiry.channel,
        stage=inquiry.stage,
        assigned_to_user_id=inquiry.assigned_to_user_id,
        created_at=inquiry.created_at,
        updated_at=inquiry.updated_at,
    )
