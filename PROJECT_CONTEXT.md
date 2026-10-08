# PROJECT_CONTEXT — Gaoji House / Homestay

> **Mục đích:** bản đồ kỹ thuật được suy ra từ mã nguồn và cấu hình đang được
> version-control tại thời điểm khảo sát. Tài liệu này giúp AI agent định vị nhanh
> trước khi lập trình; nó không thay thế nguồn scope
> `docs/KE_HOACH_PHAT_TRIEN_HOMESTAY.md`, các quyết định trong
> `.coordination/DECISIONS.md`, hay hướng dẫn bắt buộc trong `AGENTS.md`.

## 1. Tổng quan Dự án & Tech Stack

### 1.1. Sản phẩm hiện có

Repository là monorepo gồm hai ứng dụng tách biệt:

- **Guest web Gaoji House:** giới thiệu và tìm căn hộ, gallery, chi tiết căn,
  gửi yêu cầu tư vấn (lead/inquiry); mã nguồn cũ vẫn còn luồng tra cứu và đặt
  phòng.
- **Admin web:** đăng nhập và quản lý tổng quan vận hành, inquiry, căn hộ và hợp
  đồng thuê.
- **Backend API:** auth/RBAC multi-tenant theo organization, catalog căn hộ,
  upload ảnh, inquiry/service/lease và booking engine chống đặt trùng.

Quyết định D-008 đã chuyển trọng tâm hiện tại sang quảng bá 5 căn Gaoji House,
lead generation và Admin CMS; booking/payment cũ được giữ cho giai đoạn sau.
Điều này quan trọng khi đọc code vì cả hai miền nghiệp vụ vẫn cùng tồn tại.

### 1.2. Danh mục công nghệ đã xác minh

| Nhóm | Công nghệ / phiên bản thể hiện trong repo | Nguồn xác minh |
|---|---|---|
| Frontend runtime | Next.js `16.2.10`, React/React DOM `19.2.4`, App Router | `frontend/package.json`, `frontend/src/app/` |
| Frontend language | TypeScript 5, strict mode, path alias `@/*` | `frontend/package.json`, `frontend/tsconfig.json` |
| UI/CSS | Tailwind CSS 4 qua `@tailwindcss/postcss`; CSS custom properties Gaoji; `lucide-react` | `frontend/package.json`, `frontend/src/styles/gaoji/`, `frontend/src/components/gaoji/` |
| Backend runtime | Python; CI dùng 3.13, README yêu cầu 3.12+ | `.github/workflows/ci.yml`, `README.md` |
| HTTP API | FastAPI `>=0.115,<1.0`, Uvicorn `>=0.30` | `backend/requirements.txt` |
| Validation/config | Pydantic 2, `pydantic-settings`, `email-validator` | `backend/requirements.txt`, `backend/app/core/config.py`, `backend/app/schemas/` |
| Persistence | PostgreSQL 16; SQLAlchemy 2.0 async; `asyncpg`; Alembic | `docker-compose.yml`, `backend/requirements.txt`, `backend/migrations/` |
| Auth/security | Bearer JWT (`PyJWT`, HS256 mặc định), bcrypt; permission-based RBAC | `backend/app/core/security.py`, `backend/app/api/deps.py`, `backend/app/core/permissions.py` |
| Upload | FastAPI multipart + adapter local disk/Cloudflare R2; JPG/PNG/WebP kiểm tra magic bytes | `backend/app/services/storage.py`, `backend/app/api/v1/catalog.py`, `backend/app/main.py` |
| Backend quality | pytest, pytest-asyncio, HTTPX, Ruff | `backend/requirements-dev.txt`, `backend/pytest.ini`, `backend/ruff.toml` |
| Frontend quality | ESLint 9 + Next core-web-vitals/TypeScript; production build là check bắt buộc | `frontend/eslint.config.mjs`, `frontend/package.json`, `.github/workflows/ci.yml` |
| Local infrastructure | Docker Compose chỉ chạy PostgreSQL và tạo thêm DB test bằng init script | `docker-compose.yml`, `backend/scripts/init-test-db.sql` |
| CI/CD | GitHub Actions: frontend lint/build và backend Ruff/pytest với PostgreSQL service | `.github/workflows/ci.yml` |
| Deployment entry | Railpack/Procfile chạy migrate → seed demo → Uvicorn; chưa thấy manifest deploy frontend | `backend/railpack.json`, `backend/Procfile` |

Không có dependency Redis, Kafka, Celery, cổng thanh toán hoặc SDK cloud-storage
trong manifest hiện tại. Các công nghệ đó nếu xuất hiện trong tài liệu kiến trúc
chỉ là định hướng/giai đoạn sau, không phải runtime đang triển khai.

### 1.3. Cấu hình và biến môi trường

- Backend dùng `Settings` với prefix `HOMESTAY_`, đọc file `.env`, bỏ qua key
  dư. Các key suy ra trực tiếp từ field gồm `HOMESTAY_APP_NAME`,
  `HOMESTAY_DEBUG`, `HOMESTAY_DATABASE_URL`, `HOMESTAY_JWT_SECRET`,
  `HOMESTAY_JWT_ALGORITHM`, `HOMESTAY_ACCESS_TOKEN_EXPIRE_MINUTES`,
  `HOMESTAY_BOOKING_HOLD_MINUTES`, `HOMESTAY_MAX_BOOKING_NIGHTS`,
  `HOMESTAY_CORS_ORIGINS`, `HOMESTAY_UPLOAD_DIR`.
- Frontend công khai `NEXT_PUBLIC_API_URL` và `NEXT_PUBLIC_SITE_URL`; file mẫu
  là `frontend/.env.example`. URL site ảnh hưởng canonical, Open Graph,
  `robots.txt` và sitemap.
- Giá trị mặc định backend có database credential và JWT secret chỉ dành cho
  development. Production phải override ít nhất database URL, JWT secret,
  CORS origins, upload path và hai URL frontend phù hợp.

## 2. Kiến trúc & Luồng dữ liệu chính

### 2.1. Entry points

**Backend**

1. `uvicorn app.main:app` import singleton `app` do `create_app()` tạo.
2. Factory cài CORS, gắn toàn bộ router dưới `/api/v1`, chỉ mount `/uploads`
   khi dùng local storage, và khai báo `/health`.
3. `backend/app/api/v1/__init__.py` là composition root của API router.
4. `python -m app.seed --demo` là entry point seed role, amenities và dữ liệu
   demo/Gaoji.
5. Alembic đọc URL từ cùng `Settings`; chuỗi migration hiện tại là
   `dacb56ff968b` → `351b802d83ed` → `1fbacdbbe084`.

**Frontend**

1. `frontend/src/app/layout.tsx` là root layout, nạp global/Gaoji styles,
   metadata và context dùng chung.
2. `frontend/src/app/page.tsx` là trang chủ. Các route khác được ánh xạ trực
   tiếp từ App Router: `/properties`, `/properties/[id]`, `/gallery`, `/search`,
   `/lookup`, `/bookings/[code]`, `/admin`, `/admin/login`.
3. `frontend/src/app/robots.ts` và `sitemap.ts` sinh endpoint SEO.
4. `frontend/src/lib/api.ts` là client API guest; `frontend/src/app/admin/_lib/api.ts`
   là client API admin và giữ bearer token trong `sessionStorage`.

### 2.2. Luồng request tổng quát

```text
Browser / Next.js page
  -> frontend API helper (fetch, JSON, NEXT_PUBLIC_API_URL)
  -> FastAPI APIRouter (/api/v1/...)
  -> Pydantic request validation + Depends(...) auth/session
  -> route handler; booking đi tiếp qua service chuyên biệt
  -> SQLAlchemy AsyncSession / PostgreSQL
  -> Pydantic response_model
  -> frontend state/component render
```

Repository **không có repository/DAO layer riêng**. Route handlers của catalog,
auth, organization, inquiry, service, lease và admin thao tác `AsyncSession`
trực tiếp. Booking, pricing, locking và storage được tách thành service vì có
logic nghiệp vụ/concurrency hoặc cần abstraction để thay implementation.

### 2.3. Các luồng nghiệp vụ chính

#### A. Public catalog và inquiry (luồng sản phẩm hiện tại)

1. Page/component gọi `fetchProperties`, `fetchPropertyDetail`, `fetchServices`
   hoặc `createInquiry` trong `frontend/src/lib/api.ts`; `InquiryModal` cũng có
   lời gọi trực tiếp tới `POST /api/v1/inquiries`.
2. Public route query `properties`, quan hệ `property_images`, `room_types`,
   `rooms`, `property_amenities`/`amenities`, hoặc `tour_services` đang active.
3. Tạo inquiry: schema kiểm tra dữ liệu; route xác định organization (từ căn hộ
   hoặc organization mặc định), insert `inquiries`, commit và trả thông báo/mã.
4. Ảnh DB chỉ lưu tên file; `StorageService` dựng public URL. Backend được chọn
   bằng `HOMESTAY_STORAGE_BACKEND`: local ghi vào `HOMESTAY_UPLOAD_DIR`, còn R2
   dùng S3-compatible API và public domain cấu hình riêng.

#### B. Admin CMS

1. `AdminLogin` gọi `/auth/login`; token JWT lưu trong `sessionStorage`.
2. Admin API helper gắn `Authorization: Bearer ...`, đặt `cache: no-store`, xóa
   session khi nhận 401.
3. `/admin/inquiries`, `/admin/units`, `/admin/leases` và `/admin/services` đọc
   hoặc sửa model tương ứng rồi commit bằng `AsyncSession`.
4. UI `AdminDashboard` điều phối các view trạng thái, lead, căn hộ và hợp đồng.

**Ranh giới bảo mật cần chú ý:** các admin route hiện chỉ dùng
`get_current_user`; chúng chưa gọi `ensure_permission` và đa số query không lọc
theo organization của user. Đây là trạng thái code thực tế, không nên hiểu tag
`admin-*` là đã đảm bảo authorization/tenant isolation.

#### C. Auth, organization và RBAC

1. `/auth/register` hash password bằng bcrypt; `/auth/login` xác thực và phát
   access JWT; `/auth/me` trả user hiện tại.
2. `HTTPBearer(auto_error=False)` lấy token, `decode_access_token` trả user id,
   dependency tải active user.
3. `UserOrgRole` nối user–organization–role. Permission được lưu dưới dạng mảng
   JSONB trong `roles`, không hard-code quyết định theo tên role.
4. `ensure_permission` trả 403 nếu membership không chứa permission yêu cầu;
   `system:admin` bypass permission cụ thể. Catalog mutation và org/revenue dùng
   cơ chế này.

#### D. Booking và availability (code kế thừa, chưa phải trọng tâm D-008)

1. `POST /bookings` nhận schema, route ánh xạ domain exception sang HTTP error,
   rồi gọi `services.booking.create_booking`.
2. Service validate khoảng ngày, số đêm và trạng thái phòng; `LockService`
   implementation hiện tại khóa row `rooms` bằng PostgreSQL `FOR UPDATE`.
3. Trong cùng transaction, service expire hold cũ của phòng, kiểm tra giao nhau
   trong `booking_nights`, gọi pricing để chốt giá từng đêm, tạo booking
   `pending` với TTL và insert các đêm.
4. Unique constraint `(room_id, night)` là lớp bảo vệ cuối; `IntegrityError`
   rollback và được chuyển thành `RoomUnavailableError`.
5. Confirm/cancel dùng optimistic concurrency: `UPDATE ... WHERE version =
   expected_version AND status IN (...)`; cancel/expire xóa `booking_nights` để
   nhả lịch. Availability chỉ là kết quả hiển thị; create booking mới là nguồn
   quyết định cuối cùng.
6. Expiry chạy lazy khi có booking mới và có endpoint
   `POST /internal/expire-bookings` dự kiến được scheduler gọi mỗi phút. Repo
   chưa chứa scheduler/cron deployment thực tế.

#### E. Database và transaction

- `get_db()` cấp một `AsyncSession` cho mỗi dependency scope; service/route tự
  `commit()` hoặc `rollback()` thay vì middleware/unit-of-work chung.
- Model dùng UUID primary key và timestamp mixin. PostgreSQL-specific JSONB và
  row locking khiến test bắt buộc dùng PostgreSQL thật, không dùng SQLite.
- Alembic là nguồn thay đổi schema. Không dùng `Base.metadata.create_all()` khi
  khởi động production; test dùng metadata để reset schema test.

## 3. Bản đồ Thư mục

| Thư mục | Trách nhiệm | File tiêu biểu |
|---|---|---|
| `/` | Điều phối monorepo, tài liệu nhập môn, Docker database | `AGENTS.md`, `README.md`, `docker-compose.yml`, `PROJECT_CONTEXT.md` |
| `.coordination/` | Brief, task board, quyết định kiến trúc và session report; phải đọc trước coordinated work | `AGENT_ONBOARDING.md`, `BRIEF.md`, `TASKS.md`, `DECISIONS.md` |
| `.github/workflows/` | CI cho frontend và backend | `ci.yml` |
| `.githooks/` | Enforce commit message; lint/test theo vùng staged | `commit-msg`, `pre-commit`, `README.md` |
| `.agents/skills/` | Skill hỗ trợ agent, không phải runtime sản phẩm | `ui-ux-pro-max/SKILL.md` |
| `docs/` | Scope, PRD, kiến trúc và tài liệu workflow/design prompt | `KE_HOACH_PHAT_TRIEN_HOMESTAY.md`, `PRD.md`, `ARCHITECTURE.md` |
| `backend/app/` | Python application package và backend composition | `main.py`, `seed.py` |
| `backend/app/api/` | Dependency auth/database và HTTP API | `deps.py`, `v1/__init__.py` |
| `backend/app/api/v1/` | Route handlers theo resource/use case | `catalog.py`, `bookings.py`, `inquiries.py`, `admin_*.py` |
| `backend/app/core/` | Cross-cutting config, DB session, JWT/password, permission catalog | `config.py`, `database.py`, `security.py`, `permissions.py` |
| `backend/app/models/` | SQLAlchemy entities/enums/relationships | `property.py`, `booking.py`, `user.py`, `inquiry.py`, `lease.py` |
| `backend/app/schemas/` | Pydantic input/output contracts của API | `catalog.py`, `booking.py`, `inquiry.py`, `lease.py` |
| `backend/app/services/` | Logic booking/pricing/locking và abstraction storage | `booking.py`, `pricing.py`, `lock.py`, `storage.py` |
| `backend/migrations/` | Alembic environment và versioned PostgreSQL schema | `env.py`, `versions/*.py` |
| `backend/scripts/` | Bootstrap database test cho local Docker | `init-test-db.sql` |
| `backend/tests/` | Integration/domain/API tests dùng PostgreSQL thật | `conftest.py`, `test_booking_race.py`, `test_booking_ttl.py`, `test_rbac.py` |
| `frontend/src/app/` | Next.js App Router pages, root layout, SEO endpoints | `layout.tsx`, `page.tsx`, `properties/`, `admin/`, `sitemap.ts` |
| `frontend/src/app/admin/_lib/` | API contract/client riêng cho admin | `api.ts` |
| `frontend/src/components/` | Component guest/shared đời đầu và public chrome | `Header.tsx`, `Footer.tsx`, `BookingWidget.tsx` |
| `frontend/src/components/admin/` | Admin login/dashboard và các operational views | `AdminDashboard.tsx`, `InquiryView.tsx`, `UnitsView.tsx` |
| `frontend/src/components/gaoji/` | Gaoji design-system primitives và composite components | `Button.tsx`, `UnitCard.tsx`, `InquiryModal.tsx`, `index.ts` |
| `frontend/src/context/` | React client context | `LanguageContext.tsx` |
| `frontend/src/lib/` | Guest API contracts, formatting và canonical site URL | `api.ts`, `format.ts`, `site.ts` |
| `frontend/src/styles/gaoji/` | Design tokens/base/adapters bằng CSS custom properties | `colors.css`, `typography.css`, `spacing.css`, `next-adapter.css` |
| `frontend/public/` | Static logo, QR và ảnh thật được frontend phục vụ | `assets/logo*.png`, `assets/photos/*` |

## 4. Quy ước Code (Coding Conventions & Rules)

### 4.1. Python/backend

- Bốn spaces, type hints, `snake_case` cho module/function/field và
  `PascalCase` cho class/model/schema. Giới hạn dòng Ruff là 100 ký tự; target
  Python của Ruff là 3.13.
- SQLAlchemy 2.0 typed declarative dùng `Mapped[...]`/`mapped_column`; model
  dùng `UUIDPKMixin` và `TimestampMixin`. Enum nghiệp vụ kế thừa `str, Enum` để
  tương thích API/DB.
- Pydantic schema tách request/response khỏi ORM model; route khai báo
  `response_model` và status code rõ ràng.
- FastAPI dependency injection cung cấp DB/user. Authorization phải dùng
  permission code (`Perm.*` + `ensure_permission`), không kiểm tra role name
  bằng chuỗi trong handler.
- Route mỏng là hướng ưu tiên nhưng hiện chưa áp dụng đồng nhất: booking/storage
  có service; CRUD đơn giản vẫn nằm trực tiếp trong route.
- Service booking định nghĩa domain exception (`InvalidBookingError`,
  `RoomUnavailableError`, `StaleVersionError`); API boundary đổi chúng thành
  `HTTPException`. Transaction bắt lỗi phải rollback rồi re-raise/translate;
  không được nuốt exception.
- Mọi thay đổi schema phải qua migration Alembic có cả `upgrade()` và
  `downgrade()`.

### 4.2. TypeScript/frontend

- Hai spaces, strict TypeScript, component file `PascalCase.tsx`, helper
  `camelCase`, route directory theo Next.js App Router.
- Chỉ đặt `"use client"` cho component/page dùng state, event, browser API hoặc
  context. App Router page/layout export theo convention Next.js.
- Shared request/types của guest đặt trong `src/lib/api.ts`; admin dùng module
  riêng dưới `app/admin/_lib/api.ts`. Lỗi API dùng class `ApiError`/
  `AdminApiError`, đọc FastAPI `detail` và cung cấp thông báo tiếng Việt.
- Reuse token/component Gaoji thay vì tạo CSS trùng. Token được import từ
  `src/styles/gaoji/`; icons dùng component/Icon hoặc Lucide đã có.
- Trước khi sửa frontend phải đọc `frontend/AGENTS.md` và tài liệu đúng phiên
  bản trong `frontend/node_modules/next/dist/docs/`, vì repository cảnh báo
  Next.js 16 có breaking changes.

### 4.3. Error handling và fallback

- Backend trả lỗi HTTP có status/detail cụ thể cho auth, permission, not-found,
  validation, conflict và stale version.
- Frontend admin chỉ catch lỗi transport/parse để tạo lỗi có thể hành động;
  không để catch rỗng.
- Guest API hiện catch mọi lỗi ở một số hàm catalog/service và trả bộ
  `FALLBACK_GAOJI_UNITS`/dịch vụ hard-code; property không tìm thấy còn có thể
  rơi về căn đầu tiên. Đây là hành vi code hiện hữu nhưng xung đột quy tắc repo
  “không giới thiệu placeholder data như behavior hoàn tất”; không nhân rộng
  pattern này và cần task riêng để quyết định degraded UX đúng.

### 4.4. Test và quality gates

- Pytest chạy async tự động (`asyncio_mode = auto`). `conftest.py` trỏ tới
  `homestay_test`, dựng/xóa schema và cung cấp fixture session/data.
- Test tên `test_<behavior>.py`; coverage hiện thiên về integration/domain:
  race booking thật bằng nhiều session, TTL/optimistic lock, RBAC, availability,
  upload concurrent/magic bytes và API inquiry/admin.
- Booking concurrency bắt buộc PostgreSQL vì cần semantics `FOR UPDATE`; không
  thay bằng SQLite để “đơn giản hóa” test.
- Frontend chưa có test runner. Gates hiện tại là `npm run lint` và
  `npm run build`.
- CI chạy `npm ci`, lint/build với Node 22; backend cài dev requirements, chạy
  Ruff/pytest với Python 3.13 và PostgreSQL 16.

### 4.5. Git/coordination

- Bật hook bằng `git config core.hooksPath .githooks`.
- Commit code/docs theo `[phase-N][type]: mô tả`; type hợp lệ được hook giới hạn
  ở `feat|fix|test|docs|chore|refactor|perf|style|build|ci`. Chỉ coordination
  housekeeping dùng `chore(coord): ...`.
- Trước coordinated work phải đọc onboarding → brief → tasks → quyết định mới
  nhất → report agent; không sửa decision cũ, chỉ append; không tự merge PR.
- `docs/KE_HOACH_PHAT_TRIEN_HOMESTAY.md` được repository guideline chỉ định là
  nguồn scope/phase. Khi nó khác quyết định D-008 mới hơn, phải yêu cầu
  coordinator reconcile thay vì tự chọn một mô tả.

## 5. Những điểm cần lưu ý & Điểm còn thiếu

### 5.1. Rủi ro/khoảng trống đã quan sát trực tiếp

1. **Tenant authorization của admin chưa hoàn chỉnh:** authenticated user bất kỳ
   có thể đi vào các admin route; query inquiry/unit/service/lease không giới
   hạn theo membership organization. Cần bổ sung policy và regression test
   trước khi coi Admin CMS là an toàn multi-tenant.
2. **Public fallback che lỗi backend:** guest catalog/service có dữ liệu hard-code
   và catch rộng; lỗi mạng, lỗi server và not-found có thể bị hiển thị như dữ
   liệu hợp lệ. Điều này làm debugging/monitoring khó và có nguy cơ hiển thị
   thông tin không đồng bộ DB.
3. **Booking/payment lệch scope hiện tại:** UI/API booking vẫn hoạt động trong
   code, trong khi D-008 nói đóng băng checkout/payment. Chưa có feature flag
   hoặc tài liệu runtime nói route nào phải public ở production.
4. **Payment chưa triển khai:** có model `payments` và `ledger_entries`, nhưng
   chưa thấy IPN VNPay/Momo, signature validation, idempotency service, ledger
   posting hoặc API payment. Không được suy ra rằng thanh toán đã sẵn sàng.
5. **Expiry scheduler chưa triển khai:** có idempotent function và internal
   endpoint, nhưng không có cron/worker manifest. Hơn nữa cần xác minh cơ chế
   bảo vệ endpoint internal trước khi expose production.
6. **Migration ảnh lên R2 là thao tác vận hành:** adapter R2 đã có, nhưng file
   local tồn tại trước khi chuyển cấu hình phải được sao chép vào đúng key prefix;
   chưa thấy lifecycle/backup strategy cho bucket.
7. **Audit model chưa thành luồng:** bảng/model `audit_logs` tồn tại nhưng chưa
   thấy service hoặc route ghi audit cho auth/admin/booking/upload.
8. **Frontend không có automated component/E2E tests:** lint và compile không
   bắt được regression tương tác, accessibility hoặc browser flow.
9. **Deploy chưa đầy đủ:** backend có Railpack/Procfile; chưa thấy cấu hình deploy
   frontend, production PostgreSQL, persistent uploads, domain/TLS, secrets,
   observability hoặc backup.
10. **CI comment đã cũ:** comment đầu `.github/workflows/ci.yml` nói pre-commit
    tìm `package.json` ở root, nhưng hook hiện tại đã phân vùng đúng frontend và
    backend. Hành vi hook đúng; comment có thể gây nhầm.

### 5.2. Cần làm rõ với coordinator/product owner

- **Nguồn scope:** reconcile `docs/KE_HOACH_PHAT_TRIEN_HOMESTAY.md` (được chỉ
  định là source of truth) với D-008 (mới hơn và supersede một phần D-004) để
  agent biết booking/payment có được expose/deprecate hay chỉ giữ dormant.
- **Tenant admin:** organization được chọn bằng URL, token claim, membership đầu
  tiên hay một organization cố định? Role nào được phép dùng từng admin module?
- **Public data failure:** khi API unavailable, UI phải báo lỗi/empty state, dùng
  cached last-known-good, hay vẫn cho phép curated static catalog? Nếu cần static
  catalog, phải xác định nguồn sở hữu và quy trình đồng bộ thay vì fallback ẩn.
- **Scheduler:** nền tảng deploy nào sẽ gọi expiry endpoint, tần suất bao nhiêu,
  và endpoint được xác thực bằng service credential/network policy nào?
- **Upload production:** dùng persistent volume hay object storage; giới hạn dung
  lượng, backup, virus scanning, image resizing và cleanup orphan file ra sao?
- **Seed production:** Railpack/Procfile đang chạy `app.seed --demo` mỗi deploy;
  cần xác nhận seed có idempotent và demo credential/data có được phép tồn tại ở
  production không.
- **Observability:** chưa có chuẩn logging có cấu trúc, error reporting, metrics,
  tracing hay audit-retention được xác minh trong code.
- **Test coverage mong đợi cho frontend/admin:** chưa chốt browser/E2E framework
  và các critical flows phải tự động hóa.

### 5.3. Checklist nạp ngữ cảnh cho agent tiếp theo

1. Đọc `AGENTS.md`; nếu sửa frontend, đọc thêm `frontend/AGENTS.md` và Next 16
   docs cục bộ liên quan.
2. Đọc `.coordination/AGENT_ONBOARDING.md`, `BRIEF.md`, `TASKS.md`, 5 decision
   gần nhất và report tương ứng.
3. Đọc source-of-truth scope cùng D-008; dừng và làm rõ nếu task nằm ở vùng mâu
   thuẫn booking/payment versus lead-generation.
4. Lần theo route → schema → service (nếu có) → model/migration → tests trước
   khi sửa; kiểm tra tenant boundary ở mọi admin query/mutation.
5. Chạy quality gate đúng vùng và dùng PostgreSQL thật cho backend tests.
