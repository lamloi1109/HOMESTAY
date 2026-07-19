# PRD — Nền tảng Đặt phòng Homestay (MVP)

> **Trạng thái:** NHÁP — chờ họp khách chốt + ký (gate Phase 0, xem
> `docs/KE_HOACH_PHAT_TRIEN_HOMESTAY.md`). Chưa ký = chưa code.
> **Phiên bản:** 0.1 — 2026-07-18
> **Nguồn:** tổng hợp từ `docs/KE_HOACH_PHAT_TRIEN_HOMESTAY.md`,
> `.coordination/BRIEF.md` (đã reconcile theo D-004), và yêu cầu mới của khách
> (blog + Google AdSense + tiện ích căn hộ).

---

## 1. Problem statement

Chủ homestay Việt Nam (quy mô startup — một chủ, vài căn ban đầu) đang bán
phòng thủ công (Zalo/điện thoại) hoặc qua OTA ngoài, gặp: (1) rủi ro trùng
lịch khi nhận đặt phòng từ nhiều kênh, (2) không có kênh bán trực tiếp (direct
booking) để tránh hoa hồng OTA ngoài, (3) không có công cụ quản lý vận hành +
đối soát thanh toán tập trung, (4) không có kênh nội dung (blog/SEO) để tự chủ
lưu lượng khách thay vì phụ thuộc hoàn toàn vào OTA.

## 2. Success criteria (đo được)

- [ ] 0 double-booking trong test race condition tự động (N request đồng thời
      đặt cùng 1 phòng 1 đêm → đúng 1 thành công).
- [ ] Booking `pending` quá 15 phút tự expire, nhả phòng (test tự động).
- [ ] IPN thanh toán (VNPay/Momo) là nguồn sự thật duy nhất để confirm booking;
      idempotent; sai chữ ký → reject + audit log.
- [ ] Khách đặt phòng end-to-end từ mobile thật, thanh toán sandbox, nhận
      email xác nhận (Phase 4 DoD).
- [ ] Trang property hiển thị đầy đủ tiện ích căn hộ, khách lọc/tìm được theo
      tiện ích cần (ví dụ: có bếp, có máy giặt, có bãi đỗ xe).
- [ ] Blog xuất bản được bài viết mới, có SEO metadata, không làm giảm LCP
      trang search/booking (ads/blog tách biệt tài nguyên với luồng đặt phòng).
- [ ] 100% khai báo lưu trú xuất được dữ liệu chuẩn cho chủ nhà; cảnh báo
      trước 21:00 nếu có khách check-in chưa xuất báo cáo.

## 3. Đối tượng dùng & vai trò (RBAC — 4 role MVP)

| Role | Gộp từ | Việc chính |
|---|---|---|
| Guest/Member | Guest + Member | Tìm phòng, đọc blog, đặt phòng, thanh toán, xem lịch sử |
| Staff | Receptionist + Housekeeping | Check-in/out, dọn phòng, xem booking |
| Owner | Owner + Accountant | Quản lý property, giá, xem doanh thu/đối soát, viết/duyệt bài blog |
| Admin | Admin/Super Admin | Toàn quyền, cấu hình hệ thống, quản lý ads placement |

## 4. Phạm vi tính năng theo Phase (bám `KE_HOACH_PHAT_TRIEN_HOMESTAY.md`)

### Phase 1 — Foundation
Giữ nguyên schema `organizations → properties → room_types → rooms`.
**Bổ sung mới:** bảng `amenities` (danh mục chuẩn hóa: tên + icon + nhóm, ví
dụ "Tiện nghi cơ bản" / "Bếp" / "Giải trí") và bảng nối
`property_amenities`. Không dùng free-text để giữ khả năng lọc/tìm kiếm ở
Phase 4.

### Phase 2 — Booking Core ⭐
Không đổi so với KE_HOACH: Postgres `FOR UPDATE` + optimistic lock, không
Redis ở MVP.

### Phase 3 — Payment ⭐
Không đổi: VNPay + Momo, IPN là nguồn sự thật, sổ cái kép.

### Phase 4 — Guest UX (mở rộng: tiện ích + blog)
- Trang chi tiết property: hiển thị tiện ích theo nhóm (từ bảng
  `property_amenities`), filter tìm kiếm theo tiện ích cần.
- **Blog (mới):** chuyên mục nội dung (kinh nghiệm du lịch, giới thiệu khu
  vực, khuyến mãi) phục vụ SEO + direct traffic, giảm phụ thuộc OTA ngoài.
  - Cần khách quyết: **CMS admin tự đăng bài** (chi phí cao hơn: cần trang
    soạn thảo, quản lý bài viết, categories, ảnh) hay **markdown tĩnh do dev
    deploy** (chi phí thấp hơn, đủ cho vài bài/tháng giai đoạn đầu, nâng cấp
    CMS ở Phase 7 khi cần đăng thường xuyên). Khuyến nghị: bắt đầu markdown
    tĩnh cho MVP, không block Phase 4 vì chờ xây CMS.
  - SEO: cùng hạ tầng SSR/SSG Next.js với property pages, schema.org
    `BlogPosting` markup.
- **Google AdSense (mới):** đặt quảng cáo **chỉ trên trang blog**, không đặt
  trên trang search/property-detail/checkout. Lý do (xem mục 6 — rủi ro):
  ads trên luồng đặt phòng ảnh hưởng trực tiếp tới LCP < 2.5s (mục tiêu DoD
  Phase 4 gốc) và tỷ lệ chuyển đổi; blog không nằm trong luồng chuyển đổi nên
  rủi ro thấp hơn nhiều.

### Phase 5 — Vận hành
Không đổi so với KE_HOACH.

### Phase 6 — Hardening, UAT, Deploy
Không đổi. Thêm: đăng ký Google AdSense (duyệt có thể mất vài ngày—vài tuần,
tương tự merchant VNPay/Momo) — nên bắt đầu thủ tục sớm, không đợi tới Phase 6
mới nộp hồ sơ.

## 5. Non-goals (ranh cứng — không đổi so với KE_HOACH, xem thêm ở đó)

- Channel Manager đồng bộ Airbnb/Booking.com/Agoda (Phase 7+).
- Escrow wallet + auto-refund qua Payout API (Phase 7+).
- e-KYC quét CCCD + liveness (Phase 7+).
- Tự động hóa khai báo C06 (không RPA, không auto-submit) — chỉ hỗ trợ xuất
  dữ liệu.
- Đặt phòng theo giờ (hourly) — MVP chỉ Daily + Overnight.
- Smart lock / Zalo OA PIN delivery.
- Mobile app native.
- **CMS blog đầy đủ tính năng (rich editor, workflow duyệt bài nhiều người)
  ở MVP** — trừ khi khách xác nhận cần ngay (xem câu hỏi mục 7).
- **Ads ngoài trang blog** (không đặt ads ở trang search/property/checkout)
  trừ khi khách chấp nhận rủi ro giảm hiệu năng/chuyển đổi và xác nhận rõ.

## 6. Rủi ro mới phát sinh từ yêu cầu blog + ads

| Rủi ro | Mức | Giảm thiểu |
|---|---|---|
| Ads làm chậm LCP, giảm điểm SEO của chính trang mà blog muốn phục vụ | Trung | Ads chỉ ở blog, lazy-load, không ads trên luồng booking |
| Duyệt Google AdSense chậm/từ chối (site mới, ít traffic) | Trung | Nộp hồ sơ sớm (Phase 4-5), có phương án blog vẫn chạy tốt nếu ads chưa duyệt |
| Nội dung blog cần người viết liên tục — ai chịu trách nhiệm? | Trung-Cao | Cần khách xác nhận: dev chỉ làm hạ tầng, không chịu trách nhiệm content |
| Mô hình doanh thu lẫn 2 nguồn (hoa hồng booking + ads) làm phức tạp báo cáo Owner | Thấp | Ads revenue không đi qua ledger booking (Phase 3), là số liệu tách biệt lấy từ Google AdSense dashboard, không tích hợp kỹ thuật vào hệ thống |

## 7. Câu hỏi cần khách trả lời trước khi ký PRD

1. **Blog:** chấp nhận bắt đầu bằng markdown tĩnh (dev deploy bài) ở MVP, hay
   bắt buộc phải có CMS admin tự đăng bài ngay từ đầu (tăng effort Phase 4)?
2. **Ads:** đồng ý giới hạn ads chỉ ở trang blog (không ở search/property/
   checkout) để bảo vệ tỷ lệ chuyển đổi, hay có yêu cầu khác?
3. **Tiện ích:** dùng danh mục chuẩn hóa (chọn từ danh sách có sẵn + icon) hay
   cần cho phép chủ nhà tự thêm tiện ích tùy ý (free-text, khó chuẩn hóa filter)?
4. *(các mục "..." khách đang cân nhắc thêm — bổ sung vào đây khi có, không
   tự đoán.)*

## 8. Tech stack MVP (D-004 + D-005)

- Frontend: Next.js App Router, TypeScript (SSR/SSG cho SEO property + blog).
- Backend API: Python FastAPI + SQLAlchemy + Alembic (D-005).
- PostgreSQL — soft-hold lock (`FOR UPDATE`) + optimistic `version`. Không
  Redis ở MVP.
- VNPay + Momo (redirect flow) cho thanh toán.
- Không e-KYC ở MVP.

## 9. Pháp lý

- Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 (hiệu lực 1/1/2026) cho PII
  khách lưu trú.
- Website hỗ trợ xuất dữ liệu khai báo lưu trú; trách nhiệm khai báo và tuân
  thủ Luật Nhà ở/Luật Cư trú thuộc về chủ cơ sở.
- Nội dung blog + ads phải tuân thủ chính sách nội dung của Google AdSense
  (không nội dung vi phạm, có trang Privacy Policy/Cookie do dùng ads).

---

**Bàn giao khi ký:** khách xác nhận mục 7, sau đó tạm ứng 20% theo
`KE_HOACH_PHAT_TRIEN_HOMESTAY.md` Phase 0 → mở Phase 1.
