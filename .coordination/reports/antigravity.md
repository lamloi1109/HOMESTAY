# Antigravity — Session Reports

> Append-only. Xem format ở `reports/README.md`.

---

## Session 2026-08-20 21:25

**Tasks touched:** T-006
**Status changes:**
- T-006: todo → in_progress → done

**Commits / Changes:**
- [phase-1][feat]: Data Models & Alembic Migration cho Inquiries, Services, Leases & Unit Expansion (T-006)
- Models: `Inquiry`, `TourService`, `Lease`, mở rộng `Property` specs (5 căn Vinhomes Central Park: `L1.29.08`, `L3.44.09`, `L81.07.12`, `P1.27.10`, `P3.42.12`).
- Migration: `1fbacdbbe084_inquiries_services_leases_unit_expansion.py`.
- Seed: `backend/app/seed.py` hoàn thiện 5 căn hộ + 5 dịch vụ du lịch/tiện ích + tài khoản admin.
- Tests: `backend/tests/test_inquiries_and_services.py`.

**Decisions made:** D-008 (Chuyển dịch phạm vi sang Nền tảng Quảng bá Căn hộ + Lead Generation + Admin CMS theo Design System v2)

**Blockers:** none

**Next step for next session:**
- Hoàn thành T-007.

---

## Session 2026-08-20 21:30

**Tasks touched:** T-007
**Status changes:**
- T-007: todo → in_progress → done

**Commits / Changes:**
- [phase-2][feat]: Backend API Endpoints: Guest Inquiries, Admin CRM, Units & Services (T-007)
- Endpoints:
  - `POST /api/v1/inquiries`: Nhận Lead tư vấn từ khách hàng vãng lai.
  - `GET /api/v1/services`: Danh sách dịch vụ du lịch công khai.
  - `GET / PATCH /api/v1/admin/inquiries`: CRM Inbox quản lý trạng thái Lead (Mới, Đang tư vấn, Giữ chỗ, Đã chốt, Không thành).
  - `GET / PATCH /api/v1/admin/units`: Cập nhật giá thuê tháng/đêm và trạng thái phòng vận hành.
  - `GET / POST / PATCH / DELETE /api/v1/admin/services`: CRUD danh mục dịch vụ tiện ích.
  - `GET / POST / PATCH /api/v1/admin/leases`: Quản lý hợp đồng & cảnh báo hạn tạm trú < 30 ngày.
- Schemas: `app/schemas/inquiry.py`, `app/schemas/service.py`, `app/schemas/lease.py`, `app/schemas/catalog.py`.
- Tests: `backend/tests/test_api_inquiries_and_admin.py`.

**Decisions made:** none

**Blockers:** none

**Next step for next session:**
- Chuyển sang Phase 4: **Task T-008** — Đồng bộ Design System Gaoji House v2 (EB Garamond, Barlow Condensed, 0px Radius, Palette tokens) vào `frontend/`.
