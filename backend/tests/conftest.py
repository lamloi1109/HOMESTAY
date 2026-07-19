"""Test setup — chạy trên database THẬT (homestay_test trong docker compose),
không SQLite: race condition test cần đúng semantics FOR UPDATE của Postgres.
"""

import os

# Phải set TRƯỚC khi import app.* (get_settings cache theo env).
# Dùng 127.0.0.1 thay vì localhost: trên Windows, localhost có thể resolve
# sang ::1 (IPv6) và connect tới docker port-mapping bị treo.
os.environ.setdefault(
    "HOMESTAY_DATABASE_URL",
    "postgresql+asyncpg://homestay:homestay@127.0.0.1:5432/homestay_test",
)

import uuid  # noqa: E402
from decimal import Decimal  # noqa: E402

import pytest  # noqa: E402
from sqlalchemy.ext.asyncio import (  # noqa: E402
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.pool import NullPool  # noqa: E402

from app.core.config import get_settings  # noqa: E402
from app.models import (  # noqa: E402
    Base,
    Organization,
    Property,
    Room,
    RoomType,
)
from app.models.property import PropertyStatus  # noqa: E402
from app.seed import seed_core  # noqa: E402


@pytest.fixture
async def engine():
    # NullPool: mỗi session 1 connection mới — tránh connection dính event loop
    # cũ giữa các test, và cho phép nhiều connection song song trong race test.
    engine = create_async_engine(get_settings().database_url, poolclass=NullPool)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    await engine.dispose()


@pytest.fixture
async def session_factory(engine):
    return async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


@pytest.fixture
async def db(session_factory) -> AsyncSession:
    async with session_factory() as session:
        yield session


@pytest.fixture
async def seeded(db):
    await seed_core(db)


@pytest.fixture
async def demo_room(db, seeded):
    """org → property → room_type → 1 room, giá 500k/đêm."""
    org = Organization(name="Test Org", slug=f"test-{uuid.uuid4().hex[:8]}")
    db.add(org)
    await db.flush()
    prop = Property(
        org_id=org.id,
        name="Test Property",
        slug=f"prop-{uuid.uuid4().hex[:8]}",
        status=PropertyStatus.active,
    )
    db.add(prop)
    await db.flush()
    room_type = RoomType(property_id=prop.id, name="Standard", base_price=Decimal(500_000))
    db.add(room_type)
    await db.flush()
    room = Room(room_type_id=room_type.id, code="T101")
    db.add(room)
    await db.commit()
    return room
