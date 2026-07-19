import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import ensure_permission, get_current_user, get_db
from app.core.permissions import Perm
from app.models import LedgerEntry, Organization, Role, User, UserOrgRole
from app.schemas.catalog import OrgCreate, OrgOut

router = APIRouter(prefix="/orgs", tags=["orgs"])


class AddMemberRequest(BaseModel):
    email: EmailStr
    role_code: str


@router.post("", response_model=OrgOut, status_code=status.HTTP_201_CREATED)
async def create_org(
    body: OrgCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Organization:
    """Tạo org mới — người tạo tự động là Owner của org."""
    if await db.scalar(select(Organization).where(Organization.slug == body.slug)):
        raise HTTPException(status.HTTP_409_CONFLICT, "Slug đã tồn tại")
    owner_role = await db.scalar(select(Role).where(Role.code == "owner"))
    if owner_role is None:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR, "Chưa seed roles — chạy python -m app.seed"
        )
    org = Organization(name=body.name, slug=body.slug)
    db.add(org)
    await db.flush()
    db.add(UserOrgRole(user_id=user.id, org_id=org.id, role_id=owner_role.id))
    await db.commit()
    return org


@router.post("/{org_id}/members", status_code=status.HTTP_201_CREATED)
async def add_member(
    org_id: uuid.UUID,
    body: AddMemberRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Gán role cho user đã đăng ký (staff/owner/admin) trong org."""
    await ensure_permission(db, user, org_id, Perm.ORG_MANAGE)
    target = await db.scalar(select(User).where(User.email == body.email.lower()))
    if target is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User chưa đăng ký tài khoản")
    role = await db.scalar(select(Role).where(Role.code == body.role_code))
    if role is None:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Role không tồn tại")
    existing = await db.scalar(
        select(UserOrgRole).where(
            UserOrgRole.user_id == target.id, UserOrgRole.org_id == org_id
        )
    )
    if existing is not None:
        existing.role_id = role.id
    else:
        db.add(UserOrgRole(user_id=target.id, org_id=org_id, role_id=role.id))
    await db.commit()
    return {"user_id": str(target.id), "org_id": str(org_id), "role": role.code}


@router.get("/{org_id}/revenue")
async def org_revenue(
    org_id: uuid.UUID,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Tổng hợp doanh thu từ sổ cái (Phase 3 mới có số thật — giờ trả 0).

    RBAC test Phase 1 (KE_HOACH DoD): staff KHÔNG được truy cập endpoint này.
    """
    await ensure_permission(db, user, org_id, Perm.REVENUE_READ)
    total_credit = await db.scalar(
        select(func.coalesce(func.sum(LedgerEntry.credit), 0)).where(
            LedgerEntry.org_id == org_id, LedgerEntry.account == "room_revenue"
        )
    )
    return {"org_id": str(org_id), "room_revenue": int(total_credit or 0), "currency": "VND"}
