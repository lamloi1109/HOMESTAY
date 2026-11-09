# Homestay Booking Platform

Nền tảng đặt phòng trực tiếp và quản lý vận hành homestay Việt Nam.

- `backend/`: Node.js 24, Express 5, strict TypeScript, PostgreSQL (`pg`).
- `frontend/`: Next.js App Router, TypeScript, Tailwind.
- `docker-compose.yml`: PostgreSQL 16 với database dev và test riêng.

## Chạy local

Cần Docker Desktop và Node.js **24.22.0** (xem `backend/.node-version`).

```bash
docker compose up -d db
cd backend
npm ci
# Sao chép .env.example thành .env, chỉnh cấu hình nếu cần.
npm run db:migrate
npm run db:seed -- --demo
npm run dev
```

Backend ở `http://127.0.0.1:8000`; health: `GET /health`. Ở terminal khác:

```bash
cd frontend
npm ci
npm run dev
```

Frontend mặc định gọi `http://127.0.0.1:8000`; có thể đặt `NEXT_PUBLIC_API_URL`.
Tài khoản demo: `owner@example.com` / `demo12345` (chỉ tạo khi chạy `--demo`).
`npm run db:seed` chỉ thêm reference data còn thiếu. Startup không chạy seed hoặc sửa dữ liệu.

## Kiểm tra

```bash
cd backend
npm run typecheck
npm run build
npm test
# Kiểm tra backend đang chạy bằng HTTP thật, không chấp nhận fallback frontend:
npm run smoke

cd ../frontend
npm test
npm run lint
npx tsc --noEmit
npm run build
```

Test backend dùng PostgreSQL thật. `HOMESTAY_TEST_DATABASE_URL` mặc định trỏ tới
`homestay_test` từ Docker Compose. Tên database phải kết thúc `_test`; mỗi fixture
có schema và thư mục upload riêng, tự dọn sau test. Test bao gồm HTTP contracts,
RBAC, tương thích mật khẩu/JWT Python, migration legacy, ảnh local/R2 và concurrency.
CI chạy cả frontend và backend; pre-commit chạy kiểm tra cho phần được sửa.

## Runtime và triển khai backend

```bash
cd backend
npm ci
npm run typecheck
npm run build
# Bước release riêng, với backup và kiểm tra migration trước:
node dist/db/migrate.js
node dist/db/seed.js
NODE_ENV=production npm start
```

Trên PowerShell, đặt `$env:NODE_ENV='production'` trước `npm start`.
`backend/Procfile`, `railpack.json` và `Dockerfile` dùng Node; không cần Python
trong runtime. Với Railpack, root là `backend`, build command `npm run build`,
start command `npm start`. Với Docker, build bằng `docker build -t homestay-api backend`.
Chạy migration bằng một release job riêng trước khi chuyển traffic. Không seed demo
trong production. Giữ nguyên JWT secret để token cũ tiếp tục dùng được.

Cấu hình trong `backend/.env.example`: `HOMESTAY_DATABASE_URL`,
`HOMESTAY_JWT_SECRET`, `HOMESTAY_ACCESS_TOKEN_EXPIRE_MINUTES`,
`HOMESTAY_BOOKING_HOLD_MINUTES`, `HOMESTAY_MAX_BOOKING_NIGHTS`,
`HOMESTAY_CORS_ORIGINS` (JSON array), `PORT` và storage. Các URL legacy
`postgresql+asyncpg://` hoặc `postgresql+psycopg://` được chuẩn hóa ở boundary config.
Production phải đặt JWT secret riêng. Local uploads cần volume bền vững; R2 không cần volume.

Xem [migration, cutover và rollback](docs/backend-migration.md) trước khi triển khai,
và [HTTP contract baseline](docs/backend-api-contract.md) để tra endpoint.
Python `backend/app`, `tests` và Alembic `migrations` được giữ làm reference/rollback;
chúng không tham gia build, test hay startup Node. Không chạy test Python cũ trên DB đang sử dụng.

## Booking

Ba lớp chống đặt trùng được giữ nguyên trong cùng transaction/connection:

1. Khóa row phòng bằng `SELECT ... FOR UPDATE`.
2. Thu hồi hold quá hạn và kiểm tra các đêm trùng bên trong khóa.
3. Ràng buộc database `UNIQUE(room_id, night)`.

Giá tính bằng PostgreSQL NUMERIC và cộng số nguyên chính xác, trả tiền dưới dạng chuỗi.
Hold mặc định 15 phút, tối đa 30 đêm (có thể cấu hình). Scheduler hiện có tiếp tục gọi
`POST /api/v1/internal/expire-bookings` mỗi phút; endpoint idempotent.
Quyền quản lý tài sản/booking/doanh thu dựa vào permission trong organization.
API `/admin/*` giữ chính sách legacy: chỉ yêu cầu tài khoản active; thay đổi policy là scope riêng.

## Ảnh và Cloudflare R2

Local là mặc định phát triển: `HOMESTAY_STORAGE_BACKEND=local`,
`HOMESTAY_UPLOAD_DIR=uploads`. Với deployment, đặt `HOMESTAY_STORAGE_BACKEND=r2`
và các biến `HOMESTAY_R2_ENDPOINT_URL`, `HOMESTAY_R2_ACCESS_KEY_ID`,
`HOMESTAY_R2_SECRET_ACCESS_KEY`, `HOMESTAY_R2_BUCKET_NAME`,
`HOMESTAY_R2_PUBLIC_URL`, `HOMESTAY_R2_KEY_PREFIX` như `.env.example`.
Không commit credentials. Giữ nguyên domain public và prefix `properties/`, `assets/`
theo ADR; migration không upload lại ảnh hay đổi object key.

Frontend dùng `NEXT_PUBLIC_ASSET_BASE_URL` để redirect `/assets/*` sang R2.
Để trống biến này sẽ dùng file local làm fallback. Công cụ Python cũ
`backend/scripts/migrate_public_assets_to_r2.py` chỉ giữ làm reference cho migration ảnh trước đây,
không phải bước triển khai backend mới.

## Deploy frontend lên Cloudflare Workers

Trong Cloudflare Workers Builds:

| Trường | Giá trị |
| --- | --- |
| Root directory | `/frontend` |
| Deploy command | `npx wrangler deploy` |

Root `/frontend` là bắt buộc để OpenNext tìm đúng config. Lệnh tương đương từ repo root:

```bash
cd frontend
npx wrangler deploy
```

`npx wrangler preview` chỉ tạo branch preview, không dùng làm production deploy command.
Giữ `frontend/open-next.config.ts` trong Git. `frontend/wrangler.jsonc` chạy OpenNext
build trước khi deploy; `name` và service binding `WORKER_SELF_REFERENCE` phải cùng là
`gaojihouse`. Không dùng config tự sinh với `service: "frontend"` vì Worker đó không tồn tại.
