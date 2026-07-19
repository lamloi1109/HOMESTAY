import uuid

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.permissions import Perm
from app.core.security import decode_access_token
from app.models import User, UserOrgRole

_bearer = HTTPBearer(auto_error=False)


async def get_optional_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
    db: AsyncSession = Depends(get_db),
) -> User | None:
    if credentials is None:
        return None
    user_id = decode_access_token(credentials.credentials)
    if user_id is None:
        return None
    user = await db.get(User, user_id)
    if user is None or not user.is_active:
        return None
    return user


async def get_current_user(user: User | None = Depends(get_optional_user)) -> User:
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Chưa đăng nhập hoặc token không hợp lệ")
    return user


async def get_permissions_in_org(
    db: AsyncSession, user: User, org_id: uuid.UUID
) -> set[str]:
    membership = await db.scalar(
        select(UserOrgRole).where(
            UserOrgRole.user_id == user.id, UserOrgRole.org_id == org_id
        )
    )
    if membership is None:
        return set()
    return set(membership.role.permissions)


async def ensure_permission(
    db: AsyncSession, user: User, org_id: uuid.UUID, perm: str
) -> None:
    """Raise 403 nếu user không có permission trong org (system:admin qua mặt tất cả)."""
    perms = await get_permissions_in_org(db, user, org_id)
    if perm in perms or Perm.SYSTEM_ADMIN in perms:
        return
    raise HTTPException(status.HTTP_403_FORBIDDEN, f"Thiếu quyền {perm} trong org này")
