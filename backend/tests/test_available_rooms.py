"""Phòng trống theo khoảng ngày — phục vụ UI chọn phòng (T-002)."""

from datetime import date, timedelta

from app.models import Room
from app.services.booking import create_booking, get_available_rooms

TOMORROW = date.today() + timedelta(days=1)


async def test_booked_room_excluded_from_available(db, demo_room):
    # Thêm phòng thứ 2 cùng room_type
    room2 = Room(room_type_id=demo_room.room_type_id, code="T102")
    db.add(room2)
    await db.commit()

    rt_id = demo_room.room_type_id
    before = await get_available_rooms(db, rt_id, TOMORROW, TOMORROW + timedelta(days=2))
    assert {r.code for r in before} == {"T101", "T102"}

    await create_booking(
        db,
        room_id=demo_room.id,
        check_in=TOMORROW,
        check_out=TOMORROW + timedelta(days=2),
        guest_name="Guest",
        guest_email="g@example.com",
    )

    after = await get_available_rooms(db, rt_id, TOMORROW, TOMORROW + timedelta(days=2))
    assert {r.code for r in after} == {"T102"}

    # Khoảng ngày không giao (đặt [d, d+2), hỏi [d+2, d+4)) → cả 2 phòng trống
    disjoint = await get_available_rooms(
        db, rt_id, TOMORROW + timedelta(days=2), TOMORROW + timedelta(days=4)
    )
    assert {r.code for r in disjoint} == {"T101", "T102"}


async def test_invalid_range_returns_empty(db, demo_room):
    assert await get_available_rooms(db, demo_room.room_type_id, TOMORROW, TOMORROW) == []
