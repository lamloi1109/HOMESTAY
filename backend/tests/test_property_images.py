"""Upload ảnh property: RBAC, magic bytes, hiển thị trong detail, xóa (T-003)."""

import struct
import zlib

import httpx
import pytest

from app.core.database import get_db
from app.main import app
from app.services import storage as storage_module
from app.services.storage import LocalDiskStorage


def make_png() -> bytes:
    """PNG 1x1 hợp lệ, tự sinh — không cần file mẫu trong repo."""

    def chunk(tag: bytes, data: bytes) -> bytes:
        return (
            struct.pack(">I", len(data))
            + tag
            + data
            + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
        )

    ihdr = struct.pack(">IIBBBBB", 1, 1, 8, 2, 0, 0, 0)
    idat = zlib.compress(b"\x00\xff\x00\x00")
    return (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", ihdr)
        + chunk(b"IDAT", idat)
        + chunk(b"IEND", b"")
    )


@pytest.fixture
async def client(session_factory, seeded, tmp_path):
    # Storage trỏ vào thư mục tạm của test — không đụng uploads/ thật.
    storage_module._storage = LocalDiskStorage(tmp_path / "uploads")

    async def _override_get_db():
        async with session_factory() as session:
            yield session

    app.dependency_overrides[get_db] = _override_get_db
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as c:
        yield c
    app.dependency_overrides.clear()
    storage_module._storage = None


async def _login(client: httpx.AsyncClient, email: str) -> dict:
    await client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "password123", "full_name": "T"},
    )
    r = await client.post(
        "/api/v1/auth/login", json={"email": email, "password": "password123"}
    )
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


async def _setup_property(client: httpx.AsyncClient, owner: dict) -> str:
    r = await client.post(
        "/api/v1/orgs", json={"name": "Org Ảnh", "slug": "org-anh"}, headers=owner
    )
    org_id = r.json()["id"]
    r = await client.post(
        f"/api/v1/orgs/{org_id}/properties",
        json={"name": "Nhà có ảnh", "slug": "nha-co-anh"},
        headers=owner,
    )
    return r.json()["id"]


async def test_owner_uploads_staff_forbidden_and_detail_shows_image(client):
    owner = await _login(client, "owner-img@example.com")
    prop_id = await _setup_property(client, owner)
    png = make_png()

    # Chưa đăng nhập → 401
    r = await client.post(
        f"/api/v1/properties/{prop_id}/images",
        files={"file": ("anh.png", png, "image/png")},
    )
    assert r.status_code == 401

    # Người không có quyền trong org → 403
    outsider = await _login(client, "outsider-img@example.com")
    r = await client.post(
        f"/api/v1/properties/{prop_id}/images",
        files={"file": ("anh.png", png, "image/png")},
        headers=outsider,
    )
    assert r.status_code == 403

    # Owner upload OK
    r = await client.post(
        f"/api/v1/properties/{prop_id}/images",
        files={"file": ("anh.png", png, "image/png")},
        data={"alt": "Mặt tiền"},
        headers=owner,
    )
    assert r.status_code == 201, r.text
    image = r.json()
    assert image["url"].startswith("/uploads/")
    assert image["alt"] == "Mặt tiền"

    # File giả mạo đuôi ảnh nhưng magic bytes sai → 422
    r = await client.post(
        f"/api/v1/properties/{prop_id}/images",
        files={"file": ("fake.png", b"not-an-image", "image/png")},
        headers=owner,
    )
    assert r.status_code == 422

    # Detail trả kèm ảnh, list trả cover_image
    r = await client.get(f"/api/v1/properties/{prop_id}")
    assert [img["url"] for img in r.json()["images"]] == [image["url"]]
    r = await client.get("/api/v1/properties")
    listed = next(p for p in r.json() if p["id"] == prop_id)
    assert listed["cover_image"] == image["url"]

    # Xóa: outsider 403, owner 204, detail sạch
    r = await client.delete(f"/api/v1/property-images/{image['id']}", headers=outsider)
    assert r.status_code == 403
    r = await client.delete(f"/api/v1/property-images/{image['id']}", headers=owner)
    assert r.status_code == 204
    r = await client.get(f"/api/v1/properties/{prop_id}")
    assert r.json()["images"] == []
