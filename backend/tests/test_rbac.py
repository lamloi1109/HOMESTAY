"""RBAC DoD Phase 1 (KE_HOACH): staff KHÔNG truy cập được trang doanh thu."""

import httpx
import pytest

from app.core.database import get_db
from app.main import app


@pytest.fixture
async def client(session_factory, seeded):
    async def _override_get_db():
        async with session_factory() as session:
            yield session

    app.dependency_overrides[get_db] = _override_get_db
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        yield client
    app.dependency_overrides.clear()


async def _register_and_login(client: httpx.AsyncClient, email: str) -> dict:
    r = await client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "password123", "full_name": email.split("@")[0]},
    )
    assert r.status_code == 201, r.text
    r = await client.post(
        "/api/v1/auth/login", json={"email": email, "password": "password123"}
    )
    assert r.status_code == 200, r.text
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


async def test_staff_cannot_view_revenue_but_owner_can(client):
    owner_headers = await _register_and_login(client, "owner@example.com")
    staff_headers = await _register_and_login(client, "staff@example.com")

    # Owner tạo org (tự thành owner) rồi gán staff
    r = await client.post(
        "/api/v1/orgs", json={"name": "Org RBAC", "slug": "org-rbac"}, headers=owner_headers
    )
    assert r.status_code == 201, r.text
    org_id = r.json()["id"]
    r = await client.post(
        f"/api/v1/orgs/{org_id}/members",
        json={"email": "staff@example.com", "role_code": "staff"},
        headers=owner_headers,
    )
    assert r.status_code == 201, r.text

    # Staff bị chặn doanh thu
    r = await client.get(f"/api/v1/orgs/{org_id}/revenue", headers=staff_headers)
    assert r.status_code == 403

    # Owner xem được
    r = await client.get(f"/api/v1/orgs/{org_id}/revenue", headers=owner_headers)
    assert r.status_code == 200
    assert r.json()["room_revenue"] == 0

    # Người ngoài org (không membership) cũng bị chặn
    outsider_headers = await _register_and_login(client, "outsider@example.com")
    r = await client.get(f"/api/v1/orgs/{org_id}/revenue", headers=outsider_headers)
    assert r.status_code == 403

    # Chưa đăng nhập → 401
    r = await client.get(f"/api/v1/orgs/{org_id}/revenue")
    assert r.status_code == 401


async def test_staff_cannot_create_property(client):
    owner_headers = await _register_and_login(client, "owner2@example.com")
    staff_headers = await _register_and_login(client, "staff2@example.com")
    r = await client.post(
        "/api/v1/orgs", json={"name": "Org 2", "slug": "org-two"}, headers=owner_headers
    )
    org_id = r.json()["id"]
    await client.post(
        f"/api/v1/orgs/{org_id}/members",
        json={"email": "staff2@example.com", "role_code": "staff"},
        headers=owner_headers,
    )

    payload = {"name": "Nhà A", "slug": "nha-a"}
    r = await client.post(
        f"/api/v1/orgs/{org_id}/properties", json=payload, headers=staff_headers
    )
    assert r.status_code == 403

    r = await client.post(
        f"/api/v1/orgs/{org_id}/properties", json=payload, headers=owner_headers
    )
    assert r.status_code == 201
