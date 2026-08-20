from datetime import date
from decimal import Decimal
import uuid

import pytest
from sqlalchemy import select

from app.models import (
    DocumentStatus,
    Inquiry,
    InquiryChannel,
    InquiryStage,
    Lease,
    Organization,
    Property,
    PropertyStatus,
    ResidenceStatus,
    TourService,
    User,
)
from app.seed import seed_gaoji


@pytest.mark.asyncio
async def test_inquiry_lifecycle(db, seeded):
    org = Organization(name="Test Org", slug=f"org-{uuid.uuid4().hex[:8]}")
    db.add(org)
    await db.flush()

    prop = Property(
        org_id=org.id,
        name="Căn hộ Landmark 1",
        slug=f"l1-{uuid.uuid4().hex[:8]}",
        unit_code="L1.29.08-TEST",
        tower="Landmark 1",
        price_monthly=Decimal("38000000"),
        price_nightly=Decimal("2200000"),
        sqm=82,
        bedrooms=2,
        bathrooms=2,
        max_guests=4,
        operational_status="available",
        status=PropertyStatus.active,
    )
    db.add(prop)
    await db.flush()

    inquiry = Inquiry(
        org_id=org.id,
        property_id=prop.id,
        guest_name="Trần Văn Khách",
        phone="0889237833",
        zalo="0889237833",
        email="khach@example.com",
        checkin_date=date(2026, 9, 1),
        rental_term="3 tháng",
        guest_count=2,
        note="Cần căn view sông tầng cao",
        channel=InquiryChannel.zalo,
        stage=InquiryStage.new,
    )
    db.add(inquiry)
    await db.commit()

    # Query back
    saved = await db.scalar(select(Inquiry).where(Inquiry.id == inquiry.id))
    assert saved is not None
    assert saved.guest_name == "Trần Văn Khách"
    assert saved.channel == InquiryChannel.zalo
    assert saved.stage == InquiryStage.new
    assert saved.property.unit_code == "L1.29.08-TEST"

    # Stage update
    saved.stage = InquiryStage.talking
    await db.commit()
    updated = await db.scalar(select(Inquiry).where(Inquiry.id == inquiry.id))
    assert updated.stage == InquiryStage.talking


@pytest.mark.asyncio
async def test_tour_service_crud(db, seeded):
    org = Organization(name="Test Org 2", slug=f"org-{uuid.uuid4().hex[:8]}")
    db.add(org)
    await db.flush()

    svc = TourService(
        org_id=org.id,
        name="Đưa đón sân bay Tân Sơn Nhất",
        category="Di chuyển",
        price=Decimal("800000"),
        price_unit="chuyến",
        icon="car",
        is_active=True,
        sort_order=1,
    )
    db.add(svc)
    await db.commit()

    saved_svc = await db.scalar(select(TourService).where(TourService.id == svc.id))
    assert saved_svc is not None
    assert saved_svc.name == "Đưa đón sân bay Tân Sơn Nhất"
    assert saved_svc.price == Decimal("800000")
    assert saved_svc.price_unit == "chuyến"


@pytest.mark.asyncio
async def test_lease_tracking(db, seeded):
    org = Organization(name="Test Org 3", slug=f"org-{uuid.uuid4().hex[:8]}")
    db.add(org)
    await db.flush()

    prop = Property(
        org_id=org.id,
        name="Căn hộ Landmark 3",
        slug=f"l3-{uuid.uuid4().hex[:8]}",
        unit_code="L3.44.09-TEST",
        status=PropertyStatus.active,
    )
    db.add(prop)
    await db.flush()

    lease = Lease(
        org_id=org.id,
        property_id=prop.id,
        guest_name="Mr. Tanaka",
        nationality="Nhật Bản",
        phone="+81901234567",
        start_date=date(2026, 1, 1),
        end_date=date(2026, 7, 1),
        monthly_rent=Decimal("48000000"),
        residence_status=ResidenceStatus.registered,
        document_status=DocumentStatus.complete,
    )
    db.add(lease)
    await db.commit()

    saved_lease = await db.scalar(select(Lease).where(Lease.id == lease.id))
    assert saved_lease is not None
    assert saved_lease.guest_name == "Mr. Tanaka"
    assert saved_lease.residence_status == ResidenceStatus.registered
    assert saved_lease.property.unit_code == "L3.44.09-TEST"


@pytest.mark.asyncio
async def test_seed_gaoji_function(db):
    await seed_gaoji(db)

    # Verify 5 units seeded
    units = (await db.scalars(select(Property).where(Property.unit_code.is_not(None)))).all()
    unit_codes = {u.unit_code for u in units}
    expected_codes = {"L1.29.08", "L3.44.09", "L81.07.12", "P1.27.10", "P3.42.12"}
    assert expected_codes.issubset(unit_codes)

    # Verify services seeded
    services = (await db.scalars(select(TourService))).all()
    assert len(services) >= 5

    # Verify admin user
    owner = await db.scalar(select(User).where(User.email == "owner@gaojihouse.vn"))
    assert owner is not None
