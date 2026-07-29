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

## Session 2026-07-27 → 2026-07-29

**Tasks touched:** T-001, T-002, T-003 (merge), T-004
**Status changes:**
- T-001, T-002, T-003: review → done (fast-forward `97f2449` → `504fe1e`, rồi `main` lên `0a144b7`)
- T-004: (mới, claim) → review → done (PR #1, merge commit `e566eeb`)

**Commits (T-004, 7 commit):**
- ecb949e [phase-4][feat]: keo design token Gaoji House vao frontend
- 21cd4de [phase-4][feat]: keo component Gaoji House (Card, PropertyCard + phu thuoc)
- abe64d1 [phase-4][feat]: doi ten thuong hieu sang Gaoji House, wordmark serif
- 4f3fb0f chore(coord): cap nhat T-004 — component, doi ten thuong hieu, ket qua verify
- 248bddf [phase-4][feat]: dung lai trang chu theo ui_kits/guest-web/HomeScreen
- 89a3b3f [phase-4][feat]: SEO nen tang — metadata, Open Graph, sitemap, robots, JSON-LD
- 5247fb1 [phase-4][feat]: dung trang chu theo thiet ke Gaoji House - Homepage

**Decisions made:** D-007 (design system trên claude.ai/design là nguồn sự thật cho thiết kế; repo giữ bản sao một chiều ở `frontend/src/styles/gaoji/`; "Gaoji House" là tên thương hiệu chính thức; D-006 được nâng cấp chứ không bị bãi bỏ; `docs/DESIGN.md` bị bác và xoá)

**Blockers:** none

**Ghi chú — thay đổi lớn về hiểu scope:**
- Khách (chị chủ) **đã có nền tảng quản lý nhân viên + thanh toán**, và cùng nhân viên đang dùng **KiotViet** + quản lý đơn hàng qua **Excel**. Thứ chị ấy thật sự cần là **trang quảng bá để khách liên hệ tư vấn**, không phải booking engine tự phục vụ.
- Chốt hiển thị: **vẫn hiện giá, nhưng luôn để trạng thái còn phòng** — khách phải liên hệ để chốt.
- KiotViet có sản phẩm riêng cho lưu trú (**KiotViet Hotel**: sơ đồ phòng, giá theo giờ/ngày/qua đêm, đồng bộ 100+ OTA chống overbooking). **Nếu chị chủ dùng bản này thì phần lớn backend booking của ta là làm thừa.** Chưa hỏi được chị ấy dùng bản nào → đã chủ động **đóng băng đầu tư thêm vào booking engine** (chưa vá auth `/internal/expire-bookings`, chưa đưa `jwt_secret` ra env, chưa dựng scheduler).
- Ngược lại, nếu chị ấy chỉ dùng KiotViet bán lẻ + Excel thì **hai nhân viên cùng sửa một file Excel CHÍNH LÀ bài toán đặt trùng phòng** → ràng buộc `UNIQUE (room_id, night)` của T-001 vẫn có giá trị thật.

**Ghi chú — kỹ thuật:**
- `Icon.tsx` phải viết lại chứ không port được: bản gốc nạp Lucide từ CDN rồi `innerHTML` trong `useEffect` → server render ra rỗng, máy tìm kiếm không thấy gì. Bản mới dùng `lucide-react` + registry liệt kê tay 19 icon.
- `ThemeToggle` cố ý không giữ state React (ESLint `react-hooks/set-state-in-effect` chặn đúng) — nguồn sự thật là `data-theme` trên `<html>`, đặt bằng script chặn render trong `layout.tsx`.
- `frontend/.env.example` từ T-001 tới giờ **chưa bao giờ được commit** vì rule `.env*` trong `frontend/.gitignore` — đã thêm `!.env.example`.
- Gỡ hai chỗ nội dung marketing bịa: banner "ƯU ĐÃI MÙA HÈ — Giảm 20%" có sẵn trên trang chủ cũ, và copy tin cậy của design system ("Xác nhận tức thì", "Giữ giá 10 phút", "Miễn phí huỷ 24 giờ") mô tả tính năng không tồn tại.

**Nợ kỹ thuật đã ghi nhận, CHƯA sửa:**
- **Pre-commit hook chưa từng chạy một lần nào.** Nó tìm `package.json` ở gốc repo, nhưng đây là repo tách `frontend/` + `backend/` → in "bỏ qua lint/test" ở mọi commit từ `97f2449`. Repo **không có CI**. PR #1 merge với đúng một lớp bảo vệ: agent chạy lint/build bằng tay.
- Trước production: `NEXT_PUBLIC_SITE_URL` phải trỏ domain thật; thiếu ảnh Open Graph 1200×630 cho trang chủ; nav mobile ẩn hết link mà không có menu thay thế.

**Next step for next session:**
1. **CI trước tiên** — GitHub Actions chạy `npm run lint` + `npm run build` (frontend) và `pytest` (backend, cần service Postgres). Repo vừa có PR flow thật ở PR #1, CI làm ngay thì PR sau tự được kiểm.
2. **Nút liên hệ tư vấn** — trang hiện chưa có số điện thoại, nút Zalo, hay form để lại thông tin. Đứng ở góc "trang quảng bá, khách liên hệ để tư vấn" thì đây là lỗ hổng lớn nhất còn lại.
3. Dựng tiếp `Gaoji House - Property.dc.html` (trang chi tiết) — có dữ liệu thật đứng sau nên dựng được gần trọn vẹn.

**Cần hỏi khách (chặn quyết định kiến trúc):**
- Chị chủ dùng KiotViet bản nào — bán lẻ hay KiotViet Hotel?
- Xin file Excel đặt phòng thật (đã xoá thông tin cá nhân khách).
- Đã bao giờ đặt trùng phòng vì Excel chưa?

**Cần designer (chính là coordinator) làm trên claude.ai/design:**
- Sửa `components/travel/PropertyCard.jsx`: dùng `var(--clay-300)` không tồn tại trong `tokens/colors.css` (chỉ có 50/100/200/400/500/600/700) → gradient thứ ba hỏng. Repo tạm thay `--clay-400`.
- Bổ sung menu cho nav mobile.
- Cấp ảnh Open Graph 1200×630 cho trang chủ.

## Session 2026-07-29 (chiều) — T-005 CI

**Tasks touched:** T-005
**Status changes:**
- T-005: (mới) → in_progress → done (PR #3 + PR #4, `main` tại `91a3c5e`)

**Commits:**
- f99495b [phase-1][ci]: GitHub Actions — lint + build frontend, ruff + pytest backend
- 80888eb [phase-1][ci]: chot cung bo rule ruff, chan tren phien ban

**Decisions made:** none mới (thi hành đề xuất "CI pipeline" treo từ session T-002/T-003)

**Blockers:** none

**Kết quả cuối:** `main` xanh cả hai job. `pytest` chạy thật trên CI: **11 passed in 12.43s**. Đây là lần đầu tiên repo có kiểm tự động chạy thành công, sau 5 task và 4 PR.

### Cạm bẫy đã sập vào — ĐỌC TRƯỚC KHI ĐỤNG VÀO LINT

`requirements-dev.txt` để `ruff>=0.5`, **không chặn trên**. Máy dev đang 0.15.22, CI cài về 0.16.0. Hai bản bật bộ rule mặc định khác nhau → cùng một đoạn code, local báo sạch mà CI đỏ **70 lỗi**.

Trong 70 lỗi đó, **43 cái (63%) là `B008`** — "đừng gọi hàm trong giá trị mặc định của tham số" — nhắm vào `Depends()`. Đây là cú pháp **bắt buộc** của FastAPI; rule này với FastAPI là báo sai hoàn toàn.

Cách sửa đã áp dụng: `backend/ruff.toml` chốt cứng `select = ["E4","E7","E9","F"]` (đúng bằng mặc định kinh điển của ruff, chính là thứ codebase được viết dựa theo từ T-001), cộng chặn trên `ruff>=0.16,<0.17`.

**Nếu định mở rộng bộ rule lint:** đọc comment trong `backend/ruff.toml` trước. Mở nhóm `B` thì **bắt buộc** phải tắt `B008`, nếu không sẽ ăn lại đúng 43 lỗi giả này. Nhóm đáng mở thật: `I` (sắp xếp import), `UP` (cú pháp hiện đại), `DTZ`. Riêng **`DTZ011` — `date.today()` không kèm múi giờ — đáng xem thật với hệ đặt phòng**, dù cả 3 chỗ hiện nằm trong test.

### Sai lầm quy trình đã mắc (đừng lặp lại)

Mở PR #3 **trước khi** CI chạy xong → coordinator merge một thứ chưa ai chứng minh là xanh → `main` đỏ trong 10 phút. Tệ hơn: commit vá nằm trên branch mà **không có run nào chạy cho nó**, vì PR đã đóng nên sự kiện `pull_request` không kích hoạt, còn `push` chỉ chạy trên `main`. Phải mở PR #4 mới đưa bản vá lên được.

**Bài học:** đợi run xanh rồi mới đưa PR cho người merge.

### Ghi chú môi trường

- Đã nâng ruff trên máy dev lên 0.16.0 cho khớp CI. Máy khác cài lại từ `requirements-dev.txt` là tự khớp.
- Job backend lấy Postgres từ `services:` của Actions, **không phụ thuộc Docker của máy dev**. Đặt thẳng `POSTGRES_DB: homestay_test` thay `scripts/init-test-db.sql` vì service container không mount volume được.
- `conftest.py` dùng `os.environ.setdefault` nên `HOMESTAY_DATABASE_URL` đặt ở job thắng giá trị mặc định — **không phải sửa code test**.
- Build frontend không cần backend chạy: mọi trang gọi API đều `force-dynamic` + `try/catch`, không có `generateStaticParams` nào.

**Cảnh báo chưa gây hại:** cả hai job in "Node.js 20 is deprecated" cho `actions/checkout@v4`, `actions/setup-python@v5`, `actions/setup-node@v4`. GitHub đang tự chạy chúng trên Node 24. Khi bỏ lớp tương thích thì cả ba hỏng cùng lúc — nâng bản là task nhỏ, chưa gấp.

**Next step for next session:**
1. **Nút liên hệ tư vấn** — trang chưa có số điện thoại, nút Zalo, hay form để lại thông tin. Đứng ở góc "trang quảng bá, khách liên hệ để tư vấn" thì đây là lỗ hổng lớn nhất còn lại.
2. Dựng tiếp `Gaoji House - Property.dc.html` (trang chi tiết) — có dữ liệu thật đứng sau.
3. Sửa hook `pre-commit` (vẫn hỏng, đã tách task riêng). CI là lớp bảo vệ thật; hook chỉ là tiện lợi.

**Vẫn treo, không đổi từ session trước:** ba câu hỏi cho khách (KiotViet bản nào, xin file Excel, đã đặt trùng phòng chưa) và ba việc cho designer trên claude.ai/design (`--clay-300`, menu nav mobile, ảnh Open Graph).
