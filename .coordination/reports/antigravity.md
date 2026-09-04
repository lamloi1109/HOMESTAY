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
- Hoàn thành T-008.

---

## Session 2026-08-20 21:35

**Tasks touched:** T-008
**Status changes:**
- T-008: todo → in_progress → done

**Commits / Changes:**
- [phase-4][feat]: Đồng bộ Design System Gaoji House v2 (EB Garamond, Barlow Condensed, 0px Radius) (T-008)
- Tokens: `frontend/src/styles/gaoji/` (`colors.css`, `typography.css`, `radius.css` 0px, `elevation.css`, `motion.css`, `next-adapter.css`).
- Typography: Next.js Google Fonts `EB_Garamond`, `Barlow_Condensed`, `Newsreader` configured in `frontend/src/app/layout.tsx`.
- Tailwind: Tailwind CSS v4 `@theme inline` bridged with brand color palette (Jade `#1F3A2E`, Gold `#D4AF37`, Clay `#C27358`, Canvas `#F9F7F2`).
- Components: `frontend/src/components/gaoji/` (`Button`, `Badge`, `Tag`, `Input`, `Select`, `Icon`, `ContactRail`, `InquiryModal`, `Logo`, `index.ts`).
- Verification: `npm run lint` pass (0 errors), `npm run build` pass (0 errors).

**Decisions made:** none

**Blockers:** none

**Next step for next session:**
- Hoàn thành T-009.

---

## Session 2026-08-20 21:40

**Tasks touched:** T-009
**Status changes:**
- T-009: todo → in_progress → done

**Commits / Changes:**
- [phase-4][feat]: Tái cấu trúc Guest Web: Homepage, Chi Tiết Căn Hộ, Thư Viện Ảnh & Lead Modal (T-009)
- Layout: `Header.tsx` & `Footer.tsx` cập nhật nhận diện Gao Ji House v2, Contact numbers (`0889237833`), Zalo và CTA.
- Homepage: `frontend/src/app/page.tsx` — Hero sang trọng, Stats bar, Bộ sưu tập 5 căn hộ thật (`L1.29.08`, `L3.44.09`, `L81.07.12`, `P1.27.10`, `P3.42.12`), Vị trí Landmark 81 & Công viên 14ha, Dịch vụ du lịch.
- Unit Detail: `frontend/src/app/properties/[id]/page.tsx` — Breadcrumb, Thư viện ảnh gallery, Bảng layout phòng (Room layout), Tiện nghi, Sticky Sidebar Card tư vấn chốt khách.
- Component: `frontend/src/components/gaoji/UnitCard.tsx` — Hiển thị căn hộ kèm ảnh thật, giá thuê tháng/đêm, specs và nút hỏi giá.
- API Client: `frontend/src/lib/api.ts` mở rộng dữ liệu 5 căn hộ Vinhomes Central Park, Tour Services, Inquiry Input & Fallback offline.
- Assets: Sao chép 17 hình ảnh căn hộ & QR codes vào `frontend/public/assets/`.
- Verification: `npm run lint` pass (0 errors, 0 warnings); `npm run build` pass (0 errors, 7/7 routes compiled).

**Decisions made:** none

**Blockers:** none

**Next step for next session:**
- Tiến hành Phase 5: **Task T-010** — Xây dựng Admin Dashboard CMS (Status Board 5 căn, Inquiry CRM Inbox quản lý stage lead, Quản lý hợp đồng & cảnh báo 30 ngày).
