"""Tempering Phase 2 (KE_HOACH — không thương lượng): N request đồng thời đặt
cùng 1 phòng 1 đêm → đúng 1 thành công, còn lại nhận lỗi rõ ràng.
"""

import asyncio
from datetime import date, timedelta

from app.services.booking import RoomUnavailableError, create_booking

TOMORROW = date.today() + timedelta(days=1)


async def _try_book(session_factory, room_id, i: int):
    async with session_factory() as session:
        try:
            booking = await create_booking(
                session,
                room_id=room_id,
                check_in=TOMORROW,
                check_out=TOMORROW + timedelta(days=2),
                guest_name=f"Guest {i}",
                guest_email=f"guest{i}@example.com",
            )
            return ("ok", booking)
        except RoomUnavailableError as exc:
            return ("conflict", exc)


async def test_concurrent_booking_only_one_wins(session_factory, demo_room):
    n = 10
    results = await asyncio.gather(
        *[_try_book(session_factory, demo_room.id, i) for i in range(n)]
    )
    outcomes = [r[0] for r in results]
    assert outcomes.count("ok") == 1, f"kỳ vọng đúng 1 thành công, got: {outcomes}"
    assert outcomes.count("conflict") == n - 1


async def test_partial_overlap_also_blocked(session_factory, demo_room):
    """Đặt đè 1 phần khoảng ngày (không trùng hoàn toàn) vẫn phải bị chặn."""
    async with session_factory() as session:
        await create_booking(
            session,
            room_id=demo_room.id,
            check_in=TOMORROW,
            check_out=TOMORROW + timedelta(days=3),
            guest_name="First",
            guest_email="first@example.com",
        )
    # [d+2, d+5) giao với [d, d+3) tại đêm d+2 → conflict
    results = await asyncio.gather(
        *[
            _try_book_range(session_factory, demo_room.id, TOMORROW + timedelta(days=2), TOMORROW + timedelta(days=5)),
        ]
    )
    assert results[0][0] == "conflict"

    # [d+3, d+5) không giao (check_out ngày d+3 = trả phòng sáng d+3) → OK
    ok = await _try_book_range(
        session_factory, demo_room.id, TOMORROW + timedelta(days=3), TOMORROW + timedelta(days=5)
    )
    assert ok[0] == "ok"


async def _try_book_range(session_factory, room_id, check_in, check_out):
    async with session_factory() as session:
        try:
            booking = await create_booking(
                session,
                room_id=room_id,
                check_in=check_in,
                check_out=check_out,
                guest_name="Range",
                guest_email="range@example.com",
            )
            return ("ok", booking)
        except RoomUnavailableError as exc:
            return ("conflict", exc)
