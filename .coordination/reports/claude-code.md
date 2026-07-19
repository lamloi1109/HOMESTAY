# Claude Code — Session Reports

> Append-only. Xem format ở `reports/README.md`.

---

(Chưa có session nào. Session đầu tiên sẽ được append vào đây bởi Claude Code agent.)

## Session 2026-07-19 18:25

**Tasks touched:** T-000, T-001
**Status changes:**
- T-000: in_progress → review (PRD draft + visual đã commit)
- T-001: (mới, claim) → review

**Commits:**
- 9bf4e30 [phase-0][docs]: add PRD draft, visual one-pager, stitch prompts (T-000)
- 49ea422 [phase-0][chore]: remove WORKFLOW_V2.md per D-004 reconcile
- 35af43d chore(coord): log D-005 (FastAPI backend split), claim T-001, T-000 to review
- 1ed0a67 [phase-0][docs]: update PRD tech stack per D-005 (T-000)
- 8d6cfe2 [phase-1][feat]: Postgres compose + Phase 1 schema with Alembic (T-001)
- 56eef00 [phase-2][feat]: booking engine — FOR UPDATE soft-hold, TTL expire, optimistic version, LockService interface (T-001)
- cdbd197 [phase-1][feat]: auth JWT, RBAC permission-based, catalog + booking API, seed (T-001)
- d6b9447 [phase-2][test]: race condition, TTL, optimistic lock, RBAC test suite (T-001)
- 330f128 [phase-1][feat]: Next.js frontend scaffold + API client + property list SSR, README (T-001)

**Decisions made:** D-005 (tách backend FastAPI, Next.js chỉ frontend — chỉ đạo trực tiếp coordinator)

**Blockers:** none

**Ghi chú kỹ thuật:**
- Branch T-001 tạo từ nhánh T-000 (không từ main) vì cần D-005 + PRD context; coordinator merge T-000 trước rồi T-001.
- Windows: `localhost` resolve sang `::1` làm asyncpg treo khi connect docker Postgres → toàn bộ config dùng `127.0.0.1`. Đã ghi chú trong README.
- Test chạy trên Postgres thật (`homestay_test`) — 8/8 pass. Frontend Next 16.2.10 build OK.

**Next step for next session:**
- Coordinator review + merge 2 branch (T-000 → T-001).
- Task kế tiếp đề xuất: T-002 admin skeleton UI (ANTIGRAVITY, cần Stitch mockup trước), T-003 upload ảnh property (S3-compatible), T-004 CI pipeline (pytest + next build), T-005 cron expire (Task Scheduler/container).

## Session 2026-07-19 19:10

**Tasks touched:** T-002
**Status changes:**
- T-002: (mới, claim) → review

**Commits:**
- 7fb980d chore(coord): claim T-002 guest frontend, log D-006
- 571b008 [phase-2][feat]: available-rooms API + rooms in property detail, with tests (T-002)
- a988e9b [phase-4][feat]: guest UI theo art direction khách duyệt (T-002)

**Decisions made:** D-006 (Be Vietnam Pro + lucide-react + SVG art placeholder)

**Blockers:** none. Lưu ý: chưa có upload ảnh property → UI dùng SVG art placeholder (mái ngói, tông màu theo tên property); task upload ảnh sẽ thay bằng ảnh thật.

**Verification:**
- pytest 10/10 (thêm test_available_rooms), npm lint + build pass.
- Flow đặt phòng chạy thật trên browser: chọn ngày → còn N phòng → form → mã booking + countdown 15' → availability giảm real-time.

**Next step for next session:**
- Coordinator review/merge chuỗi branch: T-000 → T-001 → T-002.
- Đề xuất task mới: upload ảnh property (thay PropertyArt), trang admin skeleton (Antigravity), cron expire chạy nền, CI pipeline.

## Session 2026-07-19 20:00

**Tasks touched:** T-003
**Status changes:**
- T-003: (mới, claim) → review

**Commits:**
- f30b7dd [phase-1][feat]: property images — storage interface, upload/delete API, static serve, migration (T-003)
- 85556c0 [phase-1][test]: property images RBAC + magic bytes + cover test (T-003)
- 791c25e [phase-1][fix]: demo seed email .local -> example.com (T-003)
- 89417c8 [phase-4][feat]: hien thi anh property tren card + detail, fallback SVG art (T-003)

**Decisions made:** none (theo interface StorageService đã định trong D-005/D-006 hướng)

**Blockers:** none

**Ghi chú:**
- Phát hiện + sửa bug T-001: seed email `owner@demo.local` bị email-validator chặn khi login → `owner@example.com`.
- Docker Desktop và uvicorn bị tắt giữa session (máy user) — đã ghi memory: Docker phải start tay.
- pytest 11/11; upload ảnh demo thật qua API, verify ảnh 200 trên UI browser.

**Next step for next session:**
- Coordinator merge chuỗi: T-000 → T-001 → T-002 → T-003.
- Đề xuất tiếp: admin UI cho owner (upload ảnh không cần Swagger — giao Antigravity theo phân công), cron expire tự động, CI pipeline.
