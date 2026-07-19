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
