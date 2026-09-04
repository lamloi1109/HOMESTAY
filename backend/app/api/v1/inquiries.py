from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import Inquiry, InquiryChannel, InquiryStage, Organization, Property
from app.schemas.inquiry import InquiryCreate, InquirySuccessResponse

router = APIRouter(prefix="/inquiries", tags=["inquiries"])


@router.post("", response_model=InquirySuccessResponse, status_code=status.HTTP_201_CREATED)
async def create_inquiry(
    data: InquiryCreate,
    db: AsyncSession = Depends(get_db),
) -> InquirySuccessResponse:
    """Guest gửi yêu cầu tư vấn / hỏi giá căn hộ (Omnichannel Lead Generation).

    Không yêu cầu đăng nhập. Tự động xác định tổ chức Gaoji House và căn hộ quan tâm.
    """
    prop: Property | None = None
    if data.property_id:
        prop = await db.scalar(select(Property).where(Property.id == data.property_id))
    elif data.unit_code:
        prop = await db.scalar(select(Property).where(Property.unit_code == data.unit_code))

    # Xác định org_id (theo property nếu có, hoặc lấy org 'gaoji-house' / org đầu tiên)
    org_id = prop.org_id if prop else None
    if org_id is None:
        org = await db.scalar(select(Organization).where(Organization.slug == "gaoji-house"))
        if org is None:
            org = await db.scalar(select(Organization).limit(1))
        if org is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Chưa cấu hình tổ chức Gaoji House trong hệ thống.",
            )
        org_id = org.id

    inquiry = Inquiry(
        org_id=org_id,
        property_id=prop.id if prop else None,
        guest_name=data.guest_name.strip(),
        phone=data.phone.strip(),
        zalo=data.zalo.strip() if data.zalo else data.phone.strip(),
        email=data.email.strip() if data.email else None,
        checkin_date=data.checkin_date,
        rental_term=data.rental_term,
        guest_count=data.guest_count,
        note=data.note,
        channel=data.channel or InquiryChannel.web_form,
        stage=InquiryStage.new,
    )
    db.add(inquiry)
    await db.commit()
    await db.refresh(inquiry)

    return InquirySuccessResponse(
        success=True,
        message="Yêu cầu của bạn đã được tiếp nhận thành công. Gao Ji House sẽ liên hệ phản hồi qua Zalo / Số điện thoại trong vòng 2 giờ.",
        inquiry_id=inquiry.id,
    )
