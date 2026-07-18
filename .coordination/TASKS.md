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
- **Status:** `in_progress`
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
- **Updated:** 2026-07-18 22:30 by claude-code

---

### T-001 — [Title ngắn gọn]

- **Phase:** [0-6 hoặc 7+, khớp KE_HOACH_PHAT_TRIEN_HOMESTAY.md]
- **Status:** `todo`
- **Owner:** —
- **Branch:** —
- **Assigned type:** `ANTIGRAVITY` | `CLAUDE_CODE` | `STITCH` | `HUMAN`
- **Files touched:** `[src/pages/login.tsx, src/components/LoginForm.tsx]`
- **Depends on:** — (hoặc `T-000`)
- **Complexity:** S | M | L
- **Acceptance criteria:**
  - [ ] AC1 — [đo được]
  - [ ] AC2 — [đo được]
  - [ ] Không console error, không network 4xx/5xx
- **Verification:** [lệnh / URL / screenshot yêu cầu]
- **Blocker:** —
- **Updated:** YYYY-MM-DD HH:MM by [agent-name]

---

### T-002 — [Title]

- **Phase:** [0-6 hoặc 7+]
- **Status:** `todo`
- **Owner:** —
- **Branch:** —
- **Assigned type:** …
- **Files touched:** …
- **Depends on:** —
- **Complexity:** …
- **Acceptance criteria:**
  - [ ] …
- **Verification:** …
- **Blocker:** —
- **Updated:** YYYY-MM-DD HH:MM by …

---

## Done

> Move task xuống đây sau khi merge. Giữ full metadata để truy vết.

(empty)
