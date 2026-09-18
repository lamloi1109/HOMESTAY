# Homestay Booking Platform (MVP)

Nền tảng đặt phòng trực tiếp + quản lý vận hành cho homestay Việt Nam.
Scope/phase: `docs/KE_HOACH_PHAT_TRIEN_HOMESTAY.md` (nguồn sự thật — D-004).
Kiến trúc: FastAPI backend + Next.js frontend + PostgreSQL (D-005).

```
backend/    FastAPI + SQLAlchemy 2.0 async + Alembic — booking engine, RBAC, auth
frontend/   Next.js App Router (TypeScript, Tailwind) — SSR/SSG cho SEO
docker-compose.yml   PostgreSQL 16 (dev + test database)
```

## Chạy dev

Yêu cầu: Docker Desktop, Python 3.12+, Node 20+.

```bash
# 1. Database
docker compose up -d db

# 2. Backend (http://127.0.0.1:8000, docs tại /docs)
cd backend
python -m venv .venv
.venv/Scripts/pip install -r requirements-dev.txt   # Windows
.venv/Scripts/python -m alembic upgrade head
.venv/Scripts/python -m app.seed --demo             # roles + amenities + data demo
.venv/Scripts/python -m uvicorn app.main:app --reload

# 3. Frontend (http://localhost:3000)
cd frontend
npm install
npm run dev
```

Tài khoản demo: `owner@example.com` / `demo12345`.

> Lưu ý Windows: dùng `127.0.0.1` thay vì `localhost` khi trỏ Postgres —
> `localhost` có thể resolve sang `::1` (IPv6) và treo với docker port-mapping.

## Lưu ảnh trên Cloudflare R2

Backend mặc định tiếp tục dùng thư mục local để phát triển. Để lưu ảnh mới trên
R2, tạo bucket, bật public access bằng custom domain (khuyến nghị) hoặc `r2.dev`,
tạo S3 API token có quyền đọc/ghi bucket, rồi cấu hình các biến trong
`backend/.env.example`:

```env
HOMESTAY_STORAGE_BACKEND=r2
HOMESTAY_R2_ENDPOINT_URL=https://<account-id>.r2.cloudflarestorage.com
HOMESTAY_R2_ACCESS_KEY_ID=<access-key-id>
HOMESTAY_R2_SECRET_ACCESS_KEY=<secret-access-key>
HOMESTAY_R2_BUCKET_NAME=homestay-images
HOMESTAY_R2_PUBLIC_URL=https://images.example.com
HOMESTAY_R2_KEY_PREFIX=property-images
```

Không commit access key vào Git. Chuyển storage backend chỉ áp dụng cho upload
mới; cần sao chép các file đang có trong `backend/uploads/` vào đúng key prefix
trên R2 trước khi đổi cấu hình ở môi trường đã có dữ liệu.

## Test (Tempering Phase 2 — bắt buộc trước khi commit code booking)

```bash
cd backend
.venv/Scripts/python -m pytest -v
```

Test chạy trên database Postgres thật (`homestay_test`, tự tạo bởi docker
compose) vì race-condition test cần đúng semantics `FOR UPDATE`:

- `test_booking_race.py` — N request đồng thời đặt cùng phòng → đúng 1 thành công.
- `test_booking_ttl.py` — pending quá 15 phút tự expire, nhả phòng; optimistic
  `version` chặn double-confirm; IPN muộn sau expire bị từ chối.
- `test_rbac.py` — staff không xem được doanh thu, không tạo được property.

## Booking engine — 3 tầng chống double-booking

1. `SELECT ... FOR UPDATE` trên row `rooms` (qua interface `LockService` —
   swap Redis ở Phase 7+ không đụng business logic).
2. Check trùng đêm trên `booking_nights` trong lock (kèm expire tại chỗ các
   hold quá hạn).
3. `UNIQUE (room_id, night)` ở DB — phòng tuyến cuối, kể cả khi 1–2 có bug.

Cron expire: gọi `POST /api/v1/internal/expire-bookings` mỗi phút (idempotent).

## Cấu trúc coordination

Đọc `.coordination/AGENT_ONBOARDING.md` trước khi làm việc trong repo này.
