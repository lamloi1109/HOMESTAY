import httpx
import pytest

from app.core.database import get_db
from app.main import app
from app.seed import seed_gaoji


@pytest.fixture
async def client(session_factory, seeded, db):
    await seed_gaoji(db)

    async def _override_get_db():
        async with session_factory() as session:
            yield session

    app.dependency_overrides[get_db] = _override_get_db
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        yield client
    app.dependency_overrides.clear()


async def _login(client: httpx.AsyncClient, email: str, password: str) -> dict:
    r = await client.post(
        "/api/v1/auth/login", json={"email": email, "password": password}
    )
    assert r.status_code == 200, r.text
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


@pytest.mark.asyncio
async def test_guest_create_inquiry_and_public_services(client):
    # 1. Public list services
    r = await client.get("/api/v1/services")
    assert r.status_code == 200
    services = r.json()
    assert len(services) >= 5

    # 2. Public create inquiry with unit_code
    payload = {
        "guest_name": "Phạm Minh Tuấn",
        "phone": "0987654321",
        "zalo": "0987654321",
        "email": "tuan.pham@example.com",
        "unit_code": "L1.29.08",
        "rental_term": "6 tháng",
        "guest_count": 2,
        "note": "Khách muốn xem nhà trực tiếp vào thứ 7",
        "channel": "zalo",
    }
    r = await client.post("/api/v1/inquiries", json=payload)
    assert r.status_code == 201
    res = r.json()
    assert res["success"] is True
    assert "inquiry_id" in res


@pytest.mark.asyncio
async def test_admin_inquiries_crm(client):
    admin_headers = await _login(client, "owner@gaojihouse.vn", "gaoji2026")

    # 1. List inquiries as admin
    r = await client.get("/api/v1/admin/inquiries", headers=admin_headers)
    assert r.status_code == 200
    inquiries = r.json()
    assert len(inquiries) >= 1
    inquiry_id = inquiries[0]["id"]

    # 2. Detail inquiry
    r = await client.get(f"/api/v1/admin/inquiries/{inquiry_id}", headers=admin_headers)
    assert r.status_code == 200
    assert r.json()["id"] == inquiry_id

    # 3. Update stage to 'hold' and note
    r = await client.patch(
        f"/api/v1/admin/inquiries/{inquiry_id}",
        json={"stage": "hold", "note": "Đã gửi hợp đồng nháp qua Zalo"},
        headers=admin_headers,
    )
    assert r.status_code == 200
    assert r.json()["stage"] == "hold"


@pytest.mark.asyncio
async def test_admin_unit_management(client):
    admin_headers = await _login(client, "owner@gaojihouse.vn", "gaoji2026")

    # 1. List 5 units
    r = await client.get("/api/v1/admin/units", headers=admin_headers)
    assert r.status_code == 200
    units = r.json()
    assert len(units) >= 5
    unit = next(u for u in units if u["unit_code"] == "L1.29.08")

    # 2. Update price and operational status
    r = await client.patch(
        f"/api/v1/admin/units/{unit['id']}",
        json={"price_monthly": 40000000, "operational_status": "held"},
        headers=admin_headers,
    )
    assert r.status_code == 200
    assert r.json()["price_monthly"] == 40000000
    assert r.json()["operational_status"] == "held"


@pytest.mark.asyncio
async def test_admin_tour_services_crud(client):
    admin_headers = await _login(client, "owner@gaojihouse.vn", "gaoji2026")

    # 1. Create new service
    r = await client.post(
        "/api/v1/admin/services",
        json={
            "name": "Bữa sáng nổi tại hồ bơi (Floating Breakfast)",
            "category": "Trải nghiệm",
            "price": 450000,
            "price_unit": "set",
            "description": "Set bữa sáng kiểu Âu trình bày trên khay nổi tại hồ bơi vô cực.",
            "icon": "utensils",
            "is_active": True,
            "sort_order": 10,
        },
        headers=admin_headers,
    )
    assert r.status_code == 201
    svc = r.json()

    # 2. Update service
    r = await client.patch(
        f"/api/v1/admin/services/{svc['id']}",
        json={"price": 500000},
        headers=admin_headers,
    )
    assert r.status_code == 200
    assert r.json()["price"] == 500000

    # 3. Delete service
    r = await client.delete(f"/api/v1/admin/services/{svc['id']}", headers=admin_headers)
    assert r.status_code == 204
