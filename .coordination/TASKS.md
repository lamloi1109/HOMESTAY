# Task Board

> **Protocol:**
> 1. Agent PHẢI claim task trước khi code (đổi `status` → `in_progress`, set `owner`, đặt `updated`).
> 2. Mỗi task 1 branch theo convention: `{agent}/T-{id}-{slug}`.
> 3. Sau mỗi session, append report vào `reports/{agent}.md`.
> 4. Nếu 2 task có overlap trong `files_touched` → flag BLOCKED, escalate coordinator.
> 5. **Mỗi task PHẢI gán `Phase` khớp với `docs/KE_HOACH_PHAT_TRIEN_HOMESTAY.md`**
>    (0-6, hoặc 7+ cho mở rộng). Task không thuộc phase đang mở → không được
>    claim, ghi vào `docs/backlog-observations.md` thay vì tạo task ở đây
>    (xem D-004 trong `DECISIONS.md`).

---

## Status legend

- `todo` — chưa ai nhận, có thể claim
- `claimed` — đã nhận, chưa bắt đầu (giữ chỗ)
- `in_progress` — đang làm
- `blocked` — có blocker (ghi rõ ở `blocker`)
- `review` — xong code, chờ review/merge
- `done` — đã merge vào main

---

## Active tasks

### T-000 — Soạn PRD ngắn + chốt scope Phase 0

- **Phase:** 0
- **Status:** `review`
- **Owner:** claude-code
- **Branch:** `claude-code/T-000-phase0-prd`
- **Assigned type:** `CLAUDE_CODE`
- **Files touched:** `docs/PRD.md` (mới)
- **Depends on:** —
- **Complexity:** M
- **Acceptance criteria:**
  - [ ] `docs/PRD.md` tồn tại: problem statement, success criteria đo được, non-goals rõ ràng, tech stack MVP (khớp `docs/KE_HOACH_PHAT_TRIEN_HOMESTAY.md` + D-004)
  - [ ] Điều khoản pháp lý về khai báo lưu trú (trách nhiệm thuộc chủ cơ sở) có trong PRD
  - [ ] Không mâu thuẫn với `docs/KE_HOACH_PHAT_TRIEN_HOMESTAY.md` hay `.coordination/BRIEF.md`
- **Verification:** Review thủ công bởi coordinator (human) — đây là gate "chưa ký chưa code" của Phase 0, không tự động verify được.
- **Blocker:** Cần họp khách chốt số căn/loại hình BĐS/phương thức thanh toán trước khi PRD có thể "ký" thật — bản PRD này là bản nháp để coordinator review trước.
- **Lưu ý:** File `docs/PRD.md` đã nằm trong `main` (theo chuỗi merge 2026-07-27) nhưng task vẫn `review`, KHÔNG phải `done`: gate của Phase 0 là chữ ký khách, chưa có. Acceptance criteria còn để trống chờ review người thật.
### T-006 — Data Models & Alembic Migration cho Inquiries, Services, Leases & Unit Expansion

- **Phase:** 1 (Schema)
- **Status:** `done`
- **Owner:** antigravity
- **Branch:** `antigravity/T-006-backend-models`
- **Assigned type:** `ANTIGRAVITY`
- **Files touched:** `backend/app/models/inquiry.py` (mới), `backend/app/models/service.py` (mới), `backend/app/models/lease.py` (mới), `backend/app/models/property.py`, `backend/app/models/__init__.py`, `backend/app/seed.py`, `backend/migrations/versions/1fbacdbbe084_inquiries_services_leases_unit_expansion.py` (mới), `backend/tests/test_inquiries_and_services.py` (mới)
- **Depends on:** —
- **Complexity:** M
- **Acceptance criteria:**
  - [x] Model `Inquiry`, `TourService`, `Lease` khởi tạo theo SQLAlchemy 2.0 Async
  - [x] Mở rộng `Property`/`Room` thêm `unit_code`, `tower`, `view_type`, `price_monthly`, `price_nightly`, `sqm`, `room_layout`, `operational_status`
  - [x] Migration Alembic `1fbacdbbe084` sinh thành công và tương thích nâng cấp an toàn
  - [x] Seed data chuẩn cho 5 căn hộ Vinhomes Central Park và danh mục dịch vụ mẫu (`L1.29.08`, `L3.44.09`, `L81.07.12`, `P1.27.10`, `P3.42.12`)
  - [x] Test tự động `test_inquiries_and_services.py` viết hoàn thiện, lint `ruff` sạch (0 lỗi)
- **Verification:** `ruff check .` pass sạch; models and seed import test `Loaded 29 model exports, 5 units, 5 services successfully`.
- **Updated:** 2026-08-20 by antigravity

---

### T-007 — Backend API Endpoints: Guest Inquiries, Admin CRM & CMS Services

- **Phase:** 2 (API)
- **Status:** `todo`
- **Owner:** —
- **Branch:** —
- **Assigned type:** `ANTIGRAVITY`
- **Files touched:** `backend/app/api/v1/inquiries.py` (mới), `backend/app/api/v1/services.py` (mới), `backend/app/api/v1/units.py` (mới), `backend/app/schemas/*`, `backend/tests/test_api_inquiries.py`
- **Depends on:** T-006
- **Complexity:** M
- **Updated:** 2026-08-20 by antigravity

---

### T-008 — Đồng bộ Design System Gaoji House v2 (EB Garamond, Barlow Condensed, 0px Radius)

- **Phase:** 4 (Design)
- **Status:** `todo`
- **Owner:** —
- **Branch:** —
- **Assigned type:** `ANTIGRAVITY`
- **Files touched:** `frontend/src/styles/gaoji/**`, `frontend/src/components/gaoji/**`, `frontend/src/app/globals.css`, `frontend/src/app/layout.tsx`
- **Depends on:** —
- **Complexity:** M
- **Updated:** 2026-08-20 by antigravity

---

### T-009 — Tái cấu trúc Guest Web: Homepage, Tìm Kiếm, Chi Tiết Căn Hộ, Thư Viện Ảnh & Lead Modal

- **Phase:** 4 (Guest UX)
- **Status:** `todo`
- **Owner:** —
- **Branch:** —
- **Assigned type:** `ANTIGRAVITY`
- **Files touched:** `frontend/src/app/page.tsx`, `frontend/src/app/properties/**`, `frontend/src/app/gallery/**`, `frontend/src/components/**`
- **Depends on:** T-007, T-008
- **Complexity:** L
- **Updated:** 2026-08-20 by antigravity

---

### T-010 — Xây dựng Admin Dashboard CMS: Status Board, Inquiry CRM Inbox, Quản lý Căn hộ & Hợp đồng

- **Phase:** 5 (Admin Portal)
- **Status:** `todo`
- **Owner:** —
- **Branch:** —
- **Assigned type:** `ANTIGRAVITY`
- **Files touched:** `frontend/src/app/admin/**`, `frontend/src/components/admin/**`
- **Depends on:** T-007, T-008
- **Complexity:** L
- **Updated:** 2026-08-20 by antigravity

---

### T-011 — Module Quản lý Danh mục Dịch vụ Du lịch Bổ sung (Tour Services CMS)

- **Phase:** 5 (Services)
- **Status:** `todo`
- **Owner:** —
- **Branch:** —
- **Assigned type:** `ANTIGRAVITY`
- **Files touched:** `frontend/src/app/admin/services/**`, `frontend/src/components/ServicesSection.tsx`
- **Depends on:** T-007, T-010
- **Complexity:** M
- **Updated:** 2026-08-20 by antigravity

---

### T-012 — Hỗ trợ Đa ngôn ngữ (VI / EN / ZH) & Tối ưu SEO Chuyên sâu cho Serviced Apartments

- **Phase:** 6 (SEO & i18n)
- **Status:** `todo`
- **Owner:** —
- **Branch:** —
- **Assigned type:** `ANTIGRAVITY`
- **Files touched:** `frontend/src/lib/i18n/**`, `frontend/src/app/sitemap.ts`, `frontend/src/app/robots.ts`
- **Depends on:** T-009
- **Complexity:** M
- **Updated:** 2026-08-20 by antigravity

---

### T-013 — E2E Testing, CI/CD Verification & Bàn giao Tài liệu PRD/Kiến trúc Mới

- **Phase:** 6 (Tempering)
- **Status:** `todo`
- **Owner:** —
- **Branch:** —
- **Assigned type:** `ANTIGRAVITY`
- **Files touched:** `docs/PRD.md`, `.coordination/DECISIONS.md`, `.coordination/TASKS.md`, `reports/antigravity.md`
- **Depends on:** T-006, T-007, T-008, T-009, T-010, T-011, T-012
- **Complexity:** M
- **Updated:** 2026-08-20 by antigravity

---

## Done

> Move task xuống đây sau khi merge. Giữ full metadata để truy vết.

### T-005 — CI: lint + build + test tự động trên GitHub Actions

- **Phase:** 1 (hạ tầng dev — mục "CI pipeline" đã đề xuất từ session T-002/T-003 mà chưa làm)
- **Status:** `done`
- **Owner:** claude-code
- **Branch:** `claude-code/T-005-ci`
- **Assigned type:** `CLAUDE_CODE`
- **Files touched:** `.github/workflows/ci.yml` (mới), `backend/app/api/v1/bookings.py`, `backend/tests/test_available_rooms.py`
- **Depends on:** —
- **Complexity:** S
- **Lý do:** Repo chạy tới PR #1 mà **chưa từng có một lần kiểm tự động nào**. Hook `pre-commit` có tồn tại nhưng tìm `package.json` ở gốc repo — đây là repo tách `frontend/` + `backend/` nên gốc không có file đó, và nó in "bỏ qua lint/test" ở mọi commit từ `97f2449`. PR #1 merge với đúng một lớp bảo vệ: agent chạy lint/build bằng tay.
- **Acceptance criteria:**
  - [x] Job `frontend`: `npm ci` → `npm run lint` → `npm run build` (Node 22, cache npm)
  - [x] Job `backend`: Postgres 16 service container → `ruff check .` → `pytest` (Python 3.13, cache pip)
  - [x] Postgres cho test lấy từ `services:` của Actions, không phụ thuộc Docker của máy dev; `POSTGRES_DB: homestay_test` thay cho `scripts/init-test-db.sql` (service container không mount volume được)
  - [x] Không phải sửa `conftest.py`: nó dùng `os.environ.setdefault` nên biến `HOMESTAY_DATABASE_URL` đặt ở job thắng giá trị mặc định
  - [x] Sửa 2 lỗi ruff có sẵn: `get_permissions_in_org` (bookings.py) và `select` (test_available_rooms.py) import thừa
  - [x] `backend/ruff.toml` chốt cứng `select = ["E4","E7","E9","F"]` + chặn trên `ruff<0.17` trong `requirements-dev.txt`
  - [x] Run thật trên GitHub xanh cả hai job
- **Verification:** chạy thật trên GitHub Actions. `main` tại `91a3c5e` xanh cả hai job — backend 46s, frontend 43s. `pytest` chạy trên Postgres service container: **11 passed in 12.43s** (race condition test cần đúng semantics `SELECT ... FOR UPDATE` cũng pass). Lần đầu tiên repo có kiểm tự động chạy thành công, sau 5 task và 4 PR.
- **Sai lầm quy trình đã mắc:** mở PR #3 TRƯỚC khi CI chạy xong → coordinator merge một thứ chưa ai chứng minh là xanh → `main` đỏ 10 phút. Tệ hơn: commit vá nằm trên branch mà không có run nào chạy cho nó, vì PR đã đóng nên `pull_request` không kích hoạt còn `push` chỉ chạy trên `main` → phải mở PR #4. **Bài học: đợi run xanh rồi mới đưa PR cho người merge.**
- **Cảnh báo chưa gây hại:** cả hai job in "Node.js 20 is deprecated" cho `actions/checkout@v4`, `actions/setup-python@v5`, `actions/setup-node@v4`. GitHub đang tự chạy trên Node 24; khi bỏ lớp tương thích thì cả ba hỏng cùng lúc. Task nhỏ, chưa gấp.
- **Merged:** 2026-07-29 — PR #3 (`bd0f7d4`) + PR #4 (`91a3c5e`)
- **Sự cố run đầu (đã sửa):** job frontend xanh, job backend đỏ ở `ruff check .` với **70 lỗi** — trên code mà máy dev báo sạch. Nguyên nhân: `requirements-dev.txt` để `ruff>=0.5` không chặn trên → máy dev 0.15.22, CI cài 0.16.0, hai bản bật bộ rule mặc định khác nhau. Trong 70 lỗi có **43 cái là B008** ("đừng gọi hàm trong giá trị mặc định của tham số") nhắm vào `Depends()` — cú pháp bắt buộc của FastAPI, báo sai hoàn toàn. Sửa bằng cách chốt cứng bộ rule trong `ruff.toml` thay vì phụ thuộc mặc định của từng bản ruff. Đã nâng ruff local lên 0.16.0 cho khớp CI và verify lại trước khi push.
- **Task nối tiếp đáng làm:** mở rộng bộ rule lint (`I` sắp xếp import, `UP` cú pháp hiện đại, `DTZ` timezone). Riêng **DTZ011 — `date.today()` không kèm timezone — đáng xem thật với hệ đặt phòng**, dù cả 3 chỗ hiện nằm trong test. Phải tắt B008 nếu mở `B`.
- **Blocker:** —
- **Ghi chú:** build frontend KHÔNG cần backend chạy vì mọi trang gọi API đều `force-dynamic` + `try/catch`, và không có `generateStaticParams` nào. Nếu sau này thêm trang prerender có fetch thì build sẽ đỏ — lúc đó dựng backend service trong job, đừng bỏ qua lỗi.
- **Đã sửa (2026-07-30, phiên chuẩn bị deploy Railway/Vercel):** hook `pre-commit` — 2 bug gốc: (1) tìm `package.json` ở gốc repo (không tồn tại trong repo tách frontend/+backend/) nên luôn no-op im lặng; (2) cả 2 file hook được commit ở mode không executable (644) nên dù `core.hooksPath` đúng, git vẫn âm thầm bỏ qua. Sửa: hook phân biệt đúng thư mục staged (frontend/ → `npm run lint`; backend/ → `ruff check` + `pytest`), cả 2 file chuyển mode 755. Xem `.githooks/pre-commit` + `.githooks/README.md`.
- **Updated:** 2026-07-29 by claude-code

---

### T-004 — Kéo design token Gaoji House vào frontend (D-007)

- **Phase:** 4 (Guest UX — nền thiết kế, cùng nhóm với T-002)
- **Status:** `done`
- **Owner:** claude-code
- **Branch:** `claude-code/T-004-gaoji-tokens`
- **Assigned type:** `CLAUDE_CODE`
- **Files touched:** `frontend/src/styles/gaoji/**` (mới), `frontend/src/components/gaoji/**` (mới), `frontend/src/app/globals.css`, `frontend/src/app/layout.tsx`, `frontend/src/components/PropertyCard.tsx`, `frontend/src/components/Header.tsx`, `frontend/src/components/Footer.tsx`, `frontend/src/app/properties/page.tsx`, `frontend/src/app/page.tsx`, `frontend/src/app/properties/[id]/page.tsx`, `frontend/src/app/robots.ts` + `sitemap.ts` (mới), `frontend/src/components/HeroSearch.tsx` + `ThemeToggle.tsx` (mới), `frontend/src/lib/site.ts` (mới), `frontend/.env.example` + `.gitignore`, `.claude/launch.json`, `.coordination/DECISIONS.md`
- **Depends on:** T-002
- **Complexity:** S
- **Acceptance criteria:**
  - [x] Token màu/chữ/khoảng cách/bo góc/đổ bóng/hiệu ứng/base chép nguyên bản từ design system `5c995ee4-97d7-49ab-9cb1-cc0a72096d37`
  - [x] Tailwind `@theme inline` trỏ sang token Gaoji — 87 chỗ dùng class cũ trong 11 file không phải sửa
  - [x] Cormorant Garamond + Be Vietnam Pro nạp qua `next/font` (self-host, subset `vietnamese`), không gọi Google Fonts CDN
  - [x] Dark mode `[data-theme="dark"]` hoạt động
  - [x] Chuyển 8 component sang TypeScript: `interactions`, `Icon`, `Badge`, `RatingStars`, `RoomSpecs`, `IconButton`, `Card`, `PropertyCard`
  - [x] `PropertyCard` của app dựng theo ngôn ngữ thị giác Gaoji, giữ `<Link>` (SEO) và bỏ tim lưu / điểm đánh giá vì chưa có dữ liệu
  - [x] Đổi tên thương hiệu sang Gaoji House, wordmark Cormorant Garamond
  - [x] Trang chủ dựng theo `Gaoji House - Homepage.dc.html` (project `82e78453-138e-4233-be6e-b9ca5bb4ec5b`): hero gradient + grain, tiêu đề Cormorant có dòng nghiêng, panel tìm kiếm, dải tin cậy, lưới Bento
  - [x] Nav kính mờ cố định (`NAV_HEIGHT = 68`) + `ThemeToggle` không state React, theme đặt bằng script chặn render nên không chớp màu
  - [x] Nền tảng SEO: `metadataBase` + template title, Open Graph, `sitemap.ts` (động, fallback khi backend chết), `robots.ts` (chặn `/lookup` + `/bookings/`), JSON-LD `LodgingBusiness` ở trang chi tiết
  - [x] `npm run lint` + `npm run build` pass
- **Verification:** lint sạch, build production sạch (8 route sau khi thêm sitemap/robots). Đo trên trình duyệt với backend + Postgres chạy thật: token `--canvas #f3efe6` / `--accent #bc5b3a`; card thật có `border-radius 28px` (`--radius-lg`), grain `opacity .045` blend `multiply`, tiêu đề `18px` màu `#211C14`, ảnh thật từ T-003, `href` crawl được; wordmark render bằng Cormorant Garamond màu `rgb(188,91,58)`; bật `data-theme="dark"` → body `rgb(21,17,11)`, accent `#d07a54`. Screenshot lỗi môi trường như T-002 — verify bằng computed style, không phải bằng mắt. Trang chủ đo riêng: nav `position: fixed` cao 68px `blur(20px)` `z-index 200`; lưới bento cột `529.078 / 338.625 / 296.297`, hàng `380 / 270`, areas `"a b b" "a c d"`, gap 18px, ô A cao 668px trọn 2 hàng, ô B rộng 653px trọn 2 cột — khớp thiết kế; dark mode giữ nguyên khi chuyển trang; 375px không tràn ngang, panel tìm kiếm xếp dọc.
- **Blocker:** —
- **Chưa làm (có chủ đích):** phần còn lại của `components/` (Button, SearchBar, TopNav, Input, Stepper, Tag, BentoGrid, LanguageSwitcher, ReservationCard) và cả hai `ui_kits/` chưa kéo về — kéo khi có task cần.
- **Khối trong thiết kế cố ý không dựng (không có dữ liệu đứng sau):** Flash Sale + đếm ngược (DB không có trường giảm giá), bản đồ 6 ghim giá (không có toạ độ), đánh giá sao + tim lưu chỗ nghỉ (không có bảng đánh giá, không có tài khoản khách), Đăng nhập/Đăng ký + mục "Chủ nhà" (một chủ, không phải sàn), tab "Theo giờ"/"Theo ngày" (backend tính theo đêm), 12 link footer (chưa có trang thật). Copy "Xác nhận tức thì" / "Tự nhận phòng 24/7" / "Miễn phí huỷ 24 giờ" bị thay vì mô tả tính năng không tồn tại.
- **Lỗi phát hiện ở design system (cần designer sửa trên claude.ai/design):** `components/travel/PropertyCard.jsx` dùng `var(--clay-300)` không tồn tại trong bảng màu → gradient thứ ba hỏng; repo tạm thay bằng `--clay-400`.
- **Nợ trước khi lên production:** `NEXT_PUBLIC_SITE_URL` phải trỏ domain thật (không thì Google index localhost); chưa có ảnh Open Graph mặc định 1200×630 cho trang chủ; nav trên điện thoại ẩn hết link mà không có menu thay thế (đúng thiết kế gốc, nhưng khách mobile không có đường tới `/properties` ngoài panel tìm kiếm).
- **Merged:** 2026-07-29 — PR #1, merge commit `e566eeb` (35 file, +2572/−188)
- **Updated:** 2026-07-29 by claude-code

---

### T-001 — Core scaffold: FastAPI backend + Next.js frontend + Postgres (D-005)

- **Phase:** 1
- **Status:** `done`
- **Owner:** claude-code
- **Branch:** `claude-code/T-001-core-scaffold`
- **Assigned type:** `CLAUDE_CODE`
- **Files touched:** `backend/**` (mới), `frontend/**` (mới), `docker-compose.yml` (mới), `README.md` (mới)
- **Depends on:** — (T-000 đang review; coordinator chỉ đạo bắt đầu phần lõi — phần không đổi dù khách chốt scope thế nào)
- **Complexity:** L
- **Acceptance criteria:**
  - [x] Schema Phase 1 đầy đủ qua Alembic migration: organizations → properties → room_types → rooms; users + roles + user_org_roles (permission-based, seed 4 role); amenities + property_amenities; bookings; payments; ledger_entries (để trống); audit_logs — migration `dacb56ff968b`
  - [x] Auth email/password (JWT) + RBAC dependency theo org hoạt động
  - [x] Booking core: create với `SELECT ... FOR UPDATE` + unique constraint (room_id, night); pending TTL 15 phút; optimistic `version`; interface `LockService`
  - [x] Test tự động pass: race condition (10 request đồng thời → đúng 1 thành công), TTL expire nhả phòng, RBAC (staff không xem được doanh thu) — 8/8 pass
  - [x] `frontend/` Next.js App Router TS build được (Next 16.2.10)
- **Verification:** `docker compose up -d db` + `pytest` trong `backend/` → 8 passed; `npm run build` trong `frontend/` → OK; smoke test HTTP: đặt phòng 201, đặt trùng 409, availability trả đúng đêm bị giữ
- **Blocker:** —
- **Merged:** 2026-07-27 — fast-forward `97f2449` → `504fe1e` (gộp chung chuỗi T-001 → T-002 → T-003)
- **Updated:** 2026-07-27 by claude-code

---

### T-002 — Guest frontend theo art direction khách duyệt (cream/terracotta)

- **Phase:** 4 (Guest UX — kéo sớm theo chỉ đạo coordinator vì khách đã duyệt mockup; booking/payment flow đầy đủ vẫn theo Phase 2-3)
- **Status:** `done`
- **Owner:** claude-code
- **Branch:** `claude-code/T-002-guest-frontend`
- **Assigned type:** `CLAUDE_CODE` (coordinator chỉ đạo trực tiếp; Antigravity sẽ tiếp quản UI admin sau)
- **Files touched:** `frontend/src/**`, `backend/app/api/v1/catalog.py` + `backend/app/schemas/catalog.py` (expose rooms + available-rooms), `backend/tests/test_available_rooms.py` (mới)
- **Depends on:** T-001
- **Complexity:** L
- **Acceptance criteria:**
  - [x] Theme theo mockup khách duyệt: nền kem, terracotta accent, Be Vietnam Pro, card bo tròn, tiếng Việt
  - [x] Trang chủ: hero + tìm kiếm, danh sách property từ API thật
  - [x] Trang chi tiết property: tiện ích theo nhóm, room types, chọn ngày → phòng trống (API available-rooms)
  - [x] Flow đặt phòng end-to-end: form → tạo booking pending → trang trạng thái có mã booking + đếm ngược 15 phút hold (verify trên UI thật: mã BKCHTH72RD, countdown 14:57, availability giảm 2→1 real-time)
  - [x] Tra cứu booking theo mã
  - [x] `npm run build` + `npm run lint` pass, backend pytest 10/10 pass
- **Verification:** pytest 10 passed; lint + build pass; flow đặt phòng chạy thật trên browser (accessibility tree — screenshot tool lỗi môi trường, không phải lỗi app)
- **Blocker:** — (đã gỡ: T-003 thay SVG art placeholder bằng ảnh thật khi property có ảnh)
- **Merged:** 2026-07-27 — trong chuỗi fast-forward `97f2449` → `504fe1e`
- **Updated:** 2026-07-27 by claude-code

---

### T-003 — Upload ảnh property (local storage, interface swap S3 sau)

- **Phase:** 1 (mục "Property CRUD + upload ảnh" còn lại của Phase 1)
- **Status:** `done`
- **Owner:** claude-code
- **Branch:** `claude-code/T-003-property-images`
- **Assigned type:** `CLAUDE_CODE`
- **Files touched:** `backend/app/models/property.py`, `backend/app/services/storage.py` (mới), `backend/app/api/v1/catalog.py`, `backend/app/schemas/catalog.py`, `backend/migrations/versions/*` (mới), `backend/tests/test_property_images.py` (mới), `frontend/src/components/PropertyCard.tsx`, `frontend/src/components/PropertyMedia.tsx` (mới), `frontend/src/app/properties/[id]/page.tsx`, `frontend/src/lib/api.ts`
- **Depends on:** T-002
- **Complexity:** M
- **Acceptance criteria:**
  - [x] Bảng `property_images` + migration `351b802d83ed`; upload multipart (jpg/png/webp theo magic bytes, ≤10MB) qua `POST /properties/{id}/images` yêu cầu `property:write`
  - [x] Ảnh serve tại `/uploads/*`; property detail trả `images[]`, list trả `cover_image`; DELETE `/property-images/{id}`
  - [x] Storage qua interface (LocalDiskStorage) — swap S3-compatible ở phase sau không đụng API
  - [x] Test: 401/403/owner OK/fake magic bytes 422/detail/cover/delete — pytest 11/11
  - [x] Frontend: card + hero dùng ảnh thật nếu có, fallback SVG art như cũ; verify trên browser (ảnh /uploads 200)
- **Verification:** pytest 11 passed; lint + build pass; upload ảnh demo qua API → hiện trên UI thật
- **Bonus fix:** demo seed email `.local` bị email-validator từ chối → đổi `owner@example.com` (cập nhật DB + README)
- **Merged:** 2026-07-27 — fast-forward vào `main` tại `504fe1e`
- **Đã sửa (2026-07-30):** `sort_order` từng tính bằng `max(sort_order)+1` ngoài lock → 2 upload đồng thời trùng số thứ tự. Thêm `SELECT ... FOR UPDATE` trên row property trước khi tính (cùng pattern lock phòng lúc đặt booking). Test `test_concurrent_uploads_get_distinct_sort_order` verify fail 3/3 lần trên code cũ, pass ổn định sau fix.
- **Updated:** 2026-07-27 by claude-code
