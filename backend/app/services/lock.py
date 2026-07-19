"""LockService — interface tách riêng để swap Redis/Redlock ở Phase 7+
(KE_HOACH Phase 2: "thiết kế code có interface LockService để swap sau").

MVP: PostgresLockService dùng row lock `SELECT ... FOR UPDATE` trên bảng
rooms — mọi transaction đặt cùng phòng bị serialize, transaction sau thấy
dữ liệu nights transaction trước đã commit.
"""

import uuid
from typing import Protocol

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Room


class LockService(Protocol):
    async def lock_rooms(self, session: AsyncSession, room_ids: list[uuid.UUID]) -> list[Room]:
        """Giữ lock trên các phòng trong phạm vi transaction hiện tại.

        Trả về Room rows đã lock. Lock tự nhả khi transaction commit/rollback.
        """
        ...


class PostgresLockService:
    async def lock_rooms(self, session: AsyncSession, room_ids: list[uuid.UUID]) -> list[Room]:
        # ORDER BY id để mọi transaction lock theo cùng thứ tự → tránh deadlock
        # khi Phase 7+ cho đặt nhiều phòng trong 1 booking.
        result = await session.execute(
            select(Room).where(Room.id.in_(room_ids)).order_by(Room.id).with_for_update()
        )
        return list(result.scalars().all())


lock_service: LockService = PostgresLockService()
