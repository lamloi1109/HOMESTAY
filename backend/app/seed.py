"""Seed dữ liệu nền: 4 role MVP + danh mục tiện ích chuẩn hóa.

Idempotent — chạy lại an toàn (upsert theo code).

    python -m app.seed          # seed roles + amenities
    python -m app.seed --demo   # thêm org/property/room demo + tài khoản demo
"""

import asyncio
import sys

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import SessionFactory
from app.core.permissions import ROLE_SEED
from app.core.security import hash_password
from app.models import (
    Amenity,
    Organization,
    Property,
    PropertyAmenity,
    Role,
    Room,
    RoomType,
    User,
    UserOrgRole,
)
from app.models.property import PropertyStatus

AMENITY_SEED: list[tuple[str, str, str, str]] = [
    # (code, name, icon, group)
    ("wifi", "Wi-Fi miễn phí", "wifi", "Tiện nghi cơ bản"),
    ("air_conditioner", "Điều hòa", "air-vent", "Tiện nghi cơ bản"),
    ("hot_water", "Nước nóng", "shower-head", "Tiện nghi cơ bản"),
    ("tv", "TV", "tv", "Tiện nghi cơ bản"),
    ("towels", "Khăn tắm/ga gối", "bed", "Tiện nghi cơ bản"),
    ("kitchen", "Bếp riêng", "chef-hat", "Bếp"),
    ("refrigerator", "Tủ lạnh", "refrigerator", "Bếp"),
    ("microwave", "Lò vi sóng", "microwave", "Bếp"),
    ("kettle", "Ấm siêu tốc", "coffee", "Bếp"),
    ("washing_machine", "Máy giặt", "washing-machine", "Giặt là"),
    ("dryer", "Máy sấy quần áo", "wind", "Giặt là"),
    ("parking", "Bãi đỗ xe", "car", "Ngoài trời"),
    ("balcony", "Ban công", "sun", "Ngoài trời"),
    ("pool", "Hồ bơi", "waves", "Giải trí"),
    ("bbq", "Khu BBQ", "flame", "Giải trí"),
    ("projector", "Máy chiếu", "projector", "Giải trí"),
    ("workspace", "Góc làm việc", "laptop", "Làm việc"),
    ("elevator", "Thang máy", "arrow-up-down", "Tòa nhà"),
    ("security_24h", "Bảo vệ 24/7", "shield", "Tòa nhà"),
    ("pet_friendly", "Cho phép thú cưng", "paw-print", "Chính sách"),
]


async def seed_core(session: AsyncSession) -> None:
    for code, spec in ROLE_SEED.items():
        role = await session.scalar(select(Role).where(Role.code == code))
        if role is None:
            session.add(Role(code=code, **spec))
        else:
            role.name = spec["name"]
            role.description = spec["description"]
            role.permissions = spec["permissions"]
    for code, name, icon, group in AMENITY_SEED:
        amenity = await session.scalar(select(Amenity).where(Amenity.code == code))
        if amenity is None:
            session.add(Amenity(code=code, name=name, icon=icon, group_name=group))
    await session.commit()
    print(f"Seeded {len(ROLE_SEED)} roles, {len(AMENITY_SEED)} amenities.")


async def seed_demo(session: AsyncSession) -> None:
    """Org + property + 2 phòng + owner demo (owner@demo.local / demo12345)."""
    if await session.scalar(select(Organization).where(Organization.slug == "demo-homestay")):
        print("Demo org đã tồn tại — bỏ qua.")
        return
    owner_role = await session.scalar(select(Role).where(Role.code == "owner"))
    user = await session.scalar(select(User).where(User.email == "owner@demo.local"))
    if user is None:
        user = User(
            email="owner@demo.local",
            hashed_password=hash_password("demo12345"),
            full_name="Chủ nhà Demo",
        )
        session.add(user)
        await session.flush()
    org = Organization(name="Demo Homestay Đà Lạt", slug="demo-homestay")
    session.add(org)
    await session.flush()
    session.add(UserOrgRole(user_id=user.id, org_id=org.id, role_id=owner_role.id))
    prop = Property(
        org_id=org.id,
        name="Căn hộ view đồi thông",
        slug="can-ho-view-doi-thong",
        description="Căn hộ 1 phòng ngủ, ban công nhìn ra đồi thông.",
        address="12 Trần Hưng Đạo, Phường 3",
        city="Đà Lạt",
        status=PropertyStatus.active,
    )
    session.add(prop)
    await session.flush()
    room_type = RoomType(
        property_id=prop.id,
        name="Studio 1 giường đôi",
        base_price=650_000,
        capacity_adults=2,
    )
    session.add(room_type)
    await session.flush()
    session.add_all(
        [
            Room(room_type_id=room_type.id, code="P101"),
            Room(room_type_id=room_type.id, code="P102"),
        ]
    )
    for code in ["wifi", "kitchen", "washing_machine", "parking", "balcony"]:
        amenity = await session.scalar(select(Amenity).where(Amenity.code == code))
        if amenity:
            session.add(PropertyAmenity(property_id=prop.id, amenity_id=amenity.id))
    await session.commit()
    print("Seeded demo org/property/rooms. Login: owner@demo.local / demo12345")


async def main() -> None:
    async with SessionFactory() as session:
        await seed_core(session)
        if "--demo" in sys.argv:
            await seed_demo(session)


if __name__ == "__main__":
    asyncio.run(main())
