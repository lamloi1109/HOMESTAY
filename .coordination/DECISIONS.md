# Decision Log

> **Protocol:** APPEND-ONLY. Không edit entry cũ — nếu đổi ý, ghi entry mới và set `supersedes: D-XXX`.
>
> Lý do: audit trail. Khi project đi sai, bạn cần biết quyết định nào dẫn tới đâu, tại thời điểm nào, với thông tin gì.

---

## D-001: [Tiêu đề quyết định]

- **Date:** YYYY-MM-DD
- **Author:** human | antigravity | claude-code
- **Status:** active
- **Supersedes:** —

**Context:**
[Tại sao quyết định này nảy sinh? Trigger là gì? Tình huống nào đang đối mặt?]

**Options considered:**
1. **Option A** — [mô tả ngắn]
   - Pros: …
   - Cons: …
2. **Option B** — …
   - Pros: …
   - Cons: …

**Decision:**
[Chọn option nào, phát biểu thẳng.]

**Rationale:**
[Tại sao chọn cái đó. Nên bám vào BRIEF (constraints, non-goals) để biện minh.]

**Consequences:**
- [Ảnh hưởng downstream 1]
- [Ảnh hưởng downstream 2]
- [Task nào cần update sau decision này]

---

## D-002: …

(template như trên)

---

## Format rút gọn cho quyết định nhỏ (≤10 dòng)

Quyết định nhỏ (ví dụ: "chọn thư viện date-fns thay vì dayjs") có thể viết gọn:

### D-003: Use date-fns for date formatting
- **Date:** YYYY-MM-DD | **Author:** claude-code | **Status:** active
- **Why:** tree-shakable, TS support tốt hơn dayjs cho use case hiện tại
- **Alternatives rejected:** dayjs (bundle size lớn hơn khi không tree-shake)
- **Affects:** T-005, T-008

---

## D-004: `docs/KE_HOACH_PHAT_TRIEN_HOMESTAY.md` là nguồn sự thật về scope/phase — reconcile BRIEF.md và ARCHITECTURE.md

- **Date:** 2026-07-18
- **Author:** claude-code (human xác nhận qua AskUserQuestion)
- **Status:** active
- **Supersedes:** D-001 (tech stack "frozen": PayOS, Redis Redlock 3-node, Kafka) — không xóa D-001, chỉ ghi đè hiệu lực cho phạm vi MVP Phase 1-6.

**Context:**
Repo có 2 bộ tài liệu mô tả 2 kiến trúc/scope khác nhau: (1) `docs/ARCHITECTURE.md` +
`.coordination/BRIEF.md` bản gốc — "big design" v1 với Redis Redlock, Kafka,
PayOS, e-KYC, RPA C06 bot, multi-OTA channel manager, non-goal multi-tenant;
(2) `docs/KE_HOACH_PHAT_TRIEN_HOMESTAY.md` — bản mới hơn (2026-07-18), tự ghi
rõ là "đã hiệu chỉnh sau thẩm định D3: loại bỏ các tính năng dựa trên giả định
chưa kiểm chứng (RPA auto-submit C06)". Hai bản mâu thuẫn trực tiếp ở: cổng
thanh toán (PayOS vs VNPay/Momo), cơ chế lock (Redis vs Postgres-only ở MVP),
event bus (Kafka vs không có), e-KYC (core v1 vs Phase 7+ non-goal), C06 (RPA
bot vs chỉ hỗ trợ xuất dữ liệu), và multi-tenant (non-goal v1 vs có từ Phase 1).

**Options considered:**
1. **KE_HOACH thắng, reconcile ngược ARCHITECTURE.md/BRIEF.md** — MVP conservative,
   đã qua thẩm định D3, khớp với workflow thực thi hiện tại (`PROMPT_EXECUTOR_FABLE5.md`).
   - Pros: loại bỏ đúng phần rủi ro chưa kiểm chứng (RPA C06 không có API xác
     nhận); giảm hạ tầng (không Redis/Kafka) phù hợp quy mô MVP vài căn; khớp
     với milestone thanh toán 20/25/25/30% đã thiết kế theo phase.
   - Cons: phải viết lại phần lớn ARCHITECTURE.md/BRIEF.md; kiến trúc Phase 7+
     (Redlock, Kafka, e-KYC) phải giữ lại làm tài liệu tham khảo tương lai thay
     vì xóa.
2. **ARCHITECTURE.md/BRIEF.md gốc thắng** — giữ tầm nhìn lớn từ v1.
   - Pros: không phải viết lại tài liệu kiến trúc chi tiết đã có.
   - Cons: phục hồi RPA C06 mà D3 đã khuyến nghị loại bỏ vì thiếu API công khai
     xác nhận (rủi ro pháp lý/kỹ thuật thật); over-engineer cho quy mô vài căn
     MVP (Redis+Kafka là 2 hệ thống thêm, nhiều điểm hỏng hơn); mâu thuẫn với
     workflow thực thi hiện tại vốn đã dùng KE_HOACH làm nguồn scope.

**Decision:**
Chọn Option 1. `docs/KE_HOACH_PHAT_TRIEN_HOMESTAY.md` là nguồn sự thật cho
scope/phase/tech-stack MVP (Phase 1-6). `docs/ARCHITECTURE.md` giữ nguyên nội
dung gốc nhưng thêm banner supersede + bảng đối chiếu ở đầu file, đánh dấu rõ
phần nào áp dụng MVP và phần nào là target Phase 7+. `.coordination/BRIEF.md`
đã được sửa trực tiếp (success criteria, non-goals, tech stack, legal
reference, stakeholders) để khớp KE_HOACH.

**Rationale:**
KE_HOACH là bản có ngày sửa mới nhất, tự khai đã qua một vòng thẩm định D3 và
sửa các giả định sai (bao gồm căn cứ pháp lý đã cập nhật tên luật đúng), khớp
với nguyên tắc xuyên suốt "MVP trước, mở rộng sau" của chính kế hoạch. Giữ
nguyên văn phần thiết kế kỹ thuật gốc (Redlock flow, outbox, e-KYC fallback,
C06 RPA) làm tài liệu tham khảo Phase 7+ thay vì xóa, vì các phần đó vẫn có
giá trị kỹ thuật khi hệ thống mở rộng thật.

**Consequences:**
- Task/breakdown cho Phase 1-6 phải bám `KE_HOACH_PHAT_TRIEN_HOMESTAY.md`,
  không bám thiết kế Redis/Kafka/PayOS/e-KYC trong `ARCHITECTURE.md` gốc.
- `.coordination/TASKS.md` (task board phẳng) cần thêm field `Phase` khi tạo
  task mới để enforce kỷ luật "chỉ làm task thuộc phase đang mở".
- Quy ước commit message: dùng `[phase-N][type]: mô tả` cho mọi code thuộc
  phase (theo `PROMPT_EXECUTOR_FABLE5.md`); giữ ngoại lệ `chore(coord): ...`
  chỉ cho thao tác thuần túy trên `.coordination/*` (claim task, session report).
- `WORKFLOW_V2.md` đã bị xóa khỏi working tree nhưng vẫn được `BRIEF.md` bản
  gốc tham chiếu ("giai đoạn 1 theo Workflow V2") — đã xóa tham chiếu này khi
  reconcile.
- Nếu khách thực sự cần Redis/Kafka/PayOS/e-KYC sớm hơn Phase 7 (ví dụ do yêu
  cầu hợp đồng cụ thể), phải log quyết định mới ở đây trước khi quay lại thiết
  kế gốc — không tự ý trộn 2 kiến trúc.

---

## D-005: Tách backend Python FastAPI riêng — Next.js chỉ làm frontend

- **Date:** 2026-07-19
- **Author:** human (coordinator chỉ đạo trực tiếp) + claude-code
- **Status:** active
- **Supersedes:** một phần D-004/BRIEF mục Tech stack ("Frontend + BFF: Next.js" — Next.js không còn kiêm BFF/backend).

**Context:**
Coordinator quyết định bắt đầu code phần lõi (core) của hệ thống — phần không
đổi dù khách chốt scope thế nào — và chỉ định stack: backend Python FastAPI,
frontend Next.js, database PostgreSQL. BRIEF/D-004 trước đó ngầm định Next.js
fullstack (App Router + BFF, API routes trong cùng codebase).

**Options considered:**
1. **Next.js fullstack (giữ nguyên D-004)** — 1 codebase, 1 deploy.
   - Pros: ít repo/process hơn, không cần CORS/API contract riêng.
   - Cons: booking engine + lock + ledger viết bằng TS trong API routes khó
     test race condition độc lập; Python ecosystem (SQLAlchemy/Alembic/pytest)
     mạnh hơn cho transaction-heavy domain; coordinator muốn tách.
2. **FastAPI backend + Next.js frontend-only (chọn)** — tách 2 service.
   - Pros: backend lõi (lock, booking, ledger, RBAC) độc lập, test được bằng
     pytest chạy thẳng vào Postgres; frontend/UI (Antigravity) và backend
     (Claude Code) làm song song không giẫm file; đúng chỉ đạo coordinator.
   - Cons: thêm CORS, API contract, 2 process khi dev (docker-compose bù lại).

**Decision:**
Chọn Option 2. Cấu trúc repo: `backend/` (FastAPI + SQLAlchemy 2.0 async +
Alembic, PostgreSQL), `frontend/` (Next.js App Router, TypeScript),
`docker-compose.yml` (Postgres dev). Toàn bộ nguyên tắc lock/booking của
KE_HOACH Phase 2 giữ nguyên (Postgres `FOR UPDATE` + optimistic `version`,
không Redis ở MVP, interface `LockService` để swap Phase 7+).

**Rationale:**
Chỉ đạo trực tiếp của coordinator; đồng thời phần lõi đắt nhất của hệ thống
(booking engine chống race, sổ cái, RBAC) là transaction-heavy — tách riêng
cho phép test tự động (Tempering Phase 2) chạy độc lập UI.

**Consequences:**
- BRIEF.md mục Tech stack và PRD.md mục 8 cập nhật theo (log tại đây).
- SEO/SSR các trang public (property, blog) vẫn thuộc Next.js — frontend gọi
  FastAPI qua HTTP; cần định nghĩa API contract (OpenAPI tự sinh từ FastAPI).
- T-001 (core scaffold) tạo mới để thực thi decision này.
- CI sau này chạy 2 pipeline: pytest (backend) + lint/build (frontend).

---
