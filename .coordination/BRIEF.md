# Project Brief — Hệ thống OTA Homestay Thế hệ mới

> **Quy tắc:** File này IMMUTABLE. Chỉ update khi scope thay đổi chính thức, và phải log lý do ở `DECISIONS.md` với reference.
>
> **Cập nhật 2026-07-18 (D-004):** Nội dung bên dưới đã được reconcile theo
> `/docs/KE_HOACH_PHAT_TRIEN_HOMESTAY.md` — nguồn sự thật hiện tại về scope/phase
> cho MVP. Bản trước (v1 "big design": PayOS, Redis Redlock, e-KYC, multi-OTA
> từ ngày đầu) được giữ nguyên trong lịch sử `DECISIONS.md` D-001/D-002, xem
> D-004 để biết lý do thay đổi.

---

## Problem statement

Chủ homestay Việt Nam đang bán phòng thường xuyên gặp: (1) overbooking khi hai kênh/hai khách đặt cùng lúc, (2) giá hiển thị cho khách khác giá lúc thanh toán do cache/promotion lệch, (3) rủi ro pháp lý vì khai báo lưu trú C06 (VNeID) làm tay, dễ trễ hạn 23:00, và dữ liệu định danh khách xử lý không đúng quy định pháp luật hiện hành về bảo vệ dữ liệu cá nhân.

Hệ thống này là nền tảng đặt phòng + quản lý vận hành cho homestay, xây theo MVP trước — mở rộng sau (xem `docs/KE_HOACH_PHAT_TRIEN_HOMESTAY.md`): booking engine chống race condition bằng Postgres transaction lock (`FOR UPDATE` + optimistic version), giá chốt theo quote, sổ cái kép cho đối soát thanh toán, và hỗ trợ (không tự động hóa) khai báo C06.

## Success criteria (measurable) — MVP

- [ ] 0 double-booking trong test race condition tự động: N request đồng thời đặt cùng 1 phòng 1 đêm → đúng 1 thành công, còn lại nhận lỗi rõ ràng (Phase 2 Definition of Done).
- [ ] Booking `pending` quá TTL 15 phút tự expire, nhả phòng (test tự động).
- [ ] IPN thanh toán (VNPay/Momo) là nguồn sự thật duy nhất để confirm booking; idempotent (2 lần gọi không ghi ledger đôi); sai chữ ký → reject + audit log (Phase 3 Definition of Done).
- [ ] Sổ cái kép ghi đúng mọi giao dịch thành công, đối chiếu được (Phase 3).
- [ ] 100% khai báo lưu trú xuất được dữ liệu chuẩn cho chủ nhà; cảnh báo trước 21:00 nếu có khách check-in chưa xuất báo cáo (Phase 5).

> Các tiêu chí liên quan Redlock/PayOS/e-KYC/Kafka trong bản gốc đã dời sang
> mục "Phase 7+" — xem D-004.

## Non-goals (MVP — xem đầy đủ ở KE_HOACH phần "Non-goals MVP")

- Không xây app mobile native — web responsive là đủ.
- Không Channel Manager đồng bộ Airbnb/Booking.com/Agoda ở MVP (Phase 7+).
- Không e-KYC quét CCCD + liveness ở MVP (Phase 7+).
- Không escrow wallet + auto-refund qua Payout API ở MVP (Phase 7+, cần thỏa thuận pháp lý với cổng thanh toán).
- Không tự động hóa khai báo C06 (không RPA, không auto-submit) — chỉ hỗ trợ xuất dữ liệu để chủ nhà tự khai qua VNeID/Cổng DVC/ASM. Không tự động hóa đăng nhập/OTP/CAPTCHA trong mọi trường hợp.
- Không đặt phòng theo giờ (hourly) ở MVP — chỉ Daily + Overnight.
- Không smart lock / Zalo OA PIN delivery ở MVP.

> **Đã sửa so với bản gốc:** mục "Không làm multi-tenant SaaS ở v1" đã bị
> **loại bỏ** — KE_HOACH Phase 1 thiết kế multi-tenant (`organizations` là
> tenant gốc) ngay từ đầu, vì đây là phần nền móng đắt nhất nếu sửa sau.

## Tech stack — MVP (xem D-004; bản gốc "frozen D-001" nay là target Phase 7+)

- **Frontend + BFF:** Next.js App Router, TypeScript
- **Backend data:** PostgreSQL — soft-hold lock (`FOR UPDATE`) + optimistic `version` lock. Redis/Redlock **không** dùng ở MVP, chỉ chừa interface `LockService` để swap ở Phase 7+.
- **Thanh toán:** VNPay + Momo (redirect flow). VietQR động (PayOS/Casso) là Phase 7+.
- **e-KYC:** không có ở MVP (Phase 7+, chốt vendor sau).
- **Agent tooling:** Claude Code (backend/lock/payment) ∥ Antigravity (UI) ∥ Stitch (design) — xem `WORKFLOW_VIBECODING_2026.md` và `docs/PROMPT_EXECUTOR_FABLE5.md`. Vai trò "Fable 5 orchestrator" của bản gốc không còn áp dụng cho quy trình hiện tại.

## Constraints

- **Pháp lý:** Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 (hiệu lực 1/1/2026) cho PII khách; khai báo lưu trú trước 23:00 ngày bắt đầu lưu trú là trách nhiệm của chủ cơ sở, hệ thống chỉ hỗ trợ xuất dữ liệu.
- **Kỹ thuật:** Postgres transaction lock không được có race condition lọt lưới — test race tự động là bắt buộc, chạy trong CI (Phase 2).
- **Vận hành:** đăng ký merchant VNPay/Momo production cần hồ sơ doanh nghiệp của khách — bắt đầu thủ tục từ Phase 0, không đợi Phase 3.

## Stakeholders

- **Owner / Coordinator:** lamloi12a1@gmail.com
- **Reviewers:** human (coordinator) theo `docs/PROMPT_EXECUTOR_FABLE5.md`
- **Users:** chủ/quản lý homestay VN và khách đặt phòng

## External links

- **Kế hoạch phase + scope (nguồn sự thật):** `docs/KE_HOACH_PHAT_TRIEN_HOMESTAY.md`
- **Kiến trúc chi tiết (Phase 7+ target, xem ghi chú supersede ở đầu file):** `docs/ARCHITECTURE.md`
- **NotebookLM notebook:** [chưa tạo]
- **Repo remote / Deploy URL:** [fill khi có]

---

**Ngày tạo:** 2026-07-17
**Phiên bản brief:** 2 (reconciled 2026-07-18, xem D-004)
