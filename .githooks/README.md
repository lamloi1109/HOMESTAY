# Git hooks — enforce commit discipline

Repo này dùng `core.hooksPath` trỏ vào `.githooks/` (thay vì `.git/hooks/`
mặc định) để hook được version-control và tự động áp dụng cho mọi người clone
repo, thay vì mỗi máy phải tự cấu hình tay.

## Setup (chạy 1 lần sau khi clone)

```bash
git config core.hooksPath .githooks
```

Đã chạy sẵn cho working copy hiện tại. Clone mới / máy khác phải chạy lại
lệnh trên — Git không tự đọc `.githooks/` nếu không set `core.hooksPath`.

> Bug đã sửa: 2 file hook từng được commit ở mode **không executable (644)**
> — dù `core.hooksPath` có set đúng, git âm thầm bỏ qua hook không có quyền
> thực thi (không lỗi, không cảnh báo). Từ commit sửa lỗi này, cả hai đã là
> `755` trong git, checkout mới không cần `chmod` tay nữa.

## Hooks hiện có

- **`commit-msg`** — chặn commit nếu message không đúng convention:
  - `[phase-N][type]: mô tả` cho mọi code thuộc phase (xem
    `docs/PROMPT_EXECUTOR_FABLE5.md`).
  - `chore(coord): ...` — ngoại lệ chỉ dành cho thao tác thuần
    `.coordination/*` (claim task, session report — xem
    `.coordination/AGENT_ONBOARDING.md`).
- **`pre-commit`** — nếu staged changes đụng tới `frontend/`, chạy
  `npm run lint`; nếu đụng tới `backend/`, chạy `ruff check .` +
  `pytest` (ưu tiên `backend/.venv`, fallback `ruff`/`python3` trên PATH —
  cần Postgres chạy sẵn tại `HOMESTAY_DATABASE_URL`, mặc định
  `127.0.0.1:5432`). File ngoài 2 thư mục đó (`docs/`, `.coordination/`,
  `WORKFLOW*.md`, `README.md`) không kích hoạt gì. Chặn commit nếu bước nào
  fail.
  > Bản trước của hook này tìm `package.json` ở **gốc repo** — repo tách
  > `frontend/` + `backend/` nên gốc không có file đó, hook luôn no-op im
  > lặng cho mọi commit code (xem `.coordination/TASKS.md` T-005). Bản hiện
  > tại phân biệt đúng thư mục staged.

## Bỏ qua hook (chỉ khi thật sự cần, và phải nói rõ lý do)

`git commit --no-verify` bỏ qua cả hai hook. Không dùng trừ khi có lý do rõ
ràng — xem quy tắc "không skip hook" trong luật làm việc chung của dự án.
