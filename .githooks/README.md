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

## Hooks hiện có

- **`commit-msg`** — chặn commit nếu message không đúng convention:
  - `[phase-N][type]: mô tả` cho mọi code thuộc phase (xem
    `docs/PROMPT_EXECUTOR_FABLE5.md`).
  - `chore(coord): ...` — ngoại lệ chỉ dành cho thao tác thuần
    `.coordination/*` (claim task, session report — xem
    `.coordination/AGENT_ONBOARDING.md`).
- **`pre-commit`** — nếu có file code (ngoài `docs/`, `.coordination/`,
  `WORKFLOW*.md`, `README.md`) trong staged changes, chạy `lint` và `test`
  script từ `package.json` nếu đã tồn tại; chặn commit nếu fail. Repo hiện là
  greenfield (chưa có `package.json`) nên hook này tạm thời no-op cho code —
  nó tự kích hoạt khi `package.json` xuất hiện, không cần sửa lại hook.

## Bỏ qua hook (chỉ khi thật sự cần, và phải nói rõ lý do)

`git commit --no-verify` bỏ qua cả hai hook. Không dùng trừ khi có lý do rõ
ràng — xem quy tắc "không skip hook" trong luật làm việc chung của dự án.
