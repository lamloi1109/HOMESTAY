from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import TourService
from app.schemas.service import TourServiceOut

router = APIRouter(prefix="/services", tags=["services"])


@router.get("", response_model=list[TourServiceOut])
async def list_public_services(
    category: str | None = None,
    db: AsyncSession = Depends(get_db),
) -> list[TourService]:
    """Lấy danh sách dịch vụ du lịch & tiện ích cư trú đang hoạt động."""
    query = (
        select(TourService)
        .where(TourService.is_active.is_(True))
        .order_by(TourService.sort_order.asc(), TourService.created_at.asc())
    )
    if category:
        query = query.where(TourService.category == category)

    result = await db.scalars(query)
    return list(result.all())
