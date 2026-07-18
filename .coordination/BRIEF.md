# Project Brief — Hệ thống OTA Homestay Thế hệ mới

> **Quy tắc:** File này IMMUTABLE. Chỉ update khi scope thay đổi chính thức, và phải log lý do ở `DECISIONS.md` với reference.

---

## Problem statement

Chủ homestay Việt Nam đang bán phòng đồng thời trên nhiều kênh (website riêng, Booking.com, Agoda, Zalo) và thường xuyên gặp: (1) overbooking khi hai kênh bán cùng một phòng trong khe đồng bộ, (2) giá hiển thị cho khách khác giá lúc thanh toán do cache/promotion lệch, (3) rủi ro pháp lý vì khai báo lưu trú C06 (VNeID) làm tay, hay trễ hạn 23:00, và dữ liệu giấy tờ khách lưu trần không mã hóa — vi phạm QĐ 19/2026 và Nghị định 13/2023.

Hệ thống này là nền tảng OTA + quản lý vận hành cho homestay: booking engine chống race condition bằng Redlock + ràng buộc DB, giá chốt theo quote có TTL, e-KYC mã hóa AES-256-GCM, và pipeline khai báo C06 bán tự động có giám sát SLA.

## Success criteria (measurable)

- [ ] 0 overbooking trong stress test 200 request đồng thời cùng 1 phòng 1 đêm (chỉ 1 booking thành công, còn lại nhận 409).
- [ ] Giá lúc thanh toán luôn = giá lúc quote; quote hết hạn 10 phút buộc re-quote (test tự động).
- [ ] Luồng check-in hoàn tất được kể cả khi cả 2 provider eKYC bị giả lập down (manual fallback, verify nền sau).
- [ ] 100% khai báo lưu trú có trạng thái theo dõi được; cảnh báo host trước 21:00 nếu chưa có xác nhận.
- [ ] PII trong DB chỉ tồn tại dạng ciphertext; mọi lần giải mã có audit log.
- [ ] p95 API booking < 500ms (không tính thời gian PayOS).

## Non-goals (cycle này)

- Không xây app mobile native — web responsive là đủ.
- Không tự xây cổng thanh toán — dùng PayOS.
- Không tự động hóa bước đăng nhập/OTP/CAPTCHA trên Cổng C06 — human-in-the-loop.
- Không làm multi-tenant SaaS ở v1 — một chủ sở hữu nhiều homestay, chưa bán cho bên thứ ba.
- Không tích hợp đủ mọi OTA — v1 chỉ Booking.com + Agoda connector.

## Tech stack (frozen — xem D-001)

- **Frontend + BFF:** Next.js 15 App Router, TypeScript, Tailwind (Bento Grid)
- **Backend data:** PostgreSQL 16 (btree_gist), Redis 7 ×3 node (Redlock), Kafka
- **Thanh toán:** PayOS
- **e-KYC:** 2 provider qua adapter chung (chốt vendor ở T-010)
- **Agent tooling:** Fable 5 orchestrator + review; Sonnet 5 worker chính; Haiku cho task S đơn giản

## Constraints

- **Pháp lý:** QĐ 19/2026, khai báo C06 trước 23:00 cùng ngày, Nghị định 13/2023 (PDPL) cho PII.
- **Kỹ thuật:** Redlock không được là tuyến phòng thủ duy nhất chống overbooking — DB constraint là bảo chứng cuối (D-002).
- **Vận hành:** hệ thống phải degrade gracefully khi bên thứ ba (eKYC, C06, OTA API) down.

## Stakeholders

- **Owner / Coordinator:** lamloi12a1@gmail.com (human, giai đoạn 1 theo Workflow V2)
- **Reviewers:** Fable 5 (kiến trúc + code review cuối)
- **Users:** chủ/quản lý homestay VN và khách đặt phòng

## External links

- **Kiến trúc chi tiết:** `docs/ARCHITECTURE.md`
- **NotebookLM notebook:** [chưa tạo]
- **Repo remote / Deploy URL:** [fill khi có]

---

**Ngày tạo:** 2026-07-17
**Phiên bản brief:** 1
