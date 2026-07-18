# KẾ HOẠCH PHÁT TRIỂN NỀN TẢNG HOMESTAY — THEO GIAI ĐOẠN

> Phiên bản đã hiệu chỉnh sau thẩm định D3: giữ phần kiến trúc kỹ thuật đã verify
> (RBAC, two-phase lock, double-entry ledger, channel manager API), loại bỏ các
> tính năng dựa trên giả định chưa kiểm chứng (RPA auto-submit C06), sửa tên pháp lý
> ("PDPA 2025" → Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15, hiệu lực 1/1/2026).

---

## Nguyên tắc xuyên suốt

1. **MVP trước, mở rộng sau.** Bản spec Fable mô tả sản phẩm ở mức "năm thứ 2-3".
   Không build hết ngay — build lõi kiếm được tiền trước, các phần còn lại là
   phase trả phí thêm (tốt cho cả khách lẫn freelancer).
2. **Mỗi phase có deliverable demo được + milestone thanh toán.** Freelance
   không có milestone gắn tiền = tự đào hố scope creep.
3. **Booking lock và Payment reconciliation là "xương sống"** — làm sớm, test kỹ
   nhất, không được dồn về cuối.
4. **Pháp lý: hỗ trợ tuân thủ, không cam kết thay khách.** Website cung cấp
   dữ liệu để chủ nhà khai báo lưu trú (qua VNeID/Cổng DVC/phần mềm ASM),
   KHÔNG tự động đẩy lên C06 (không có API công khai được xác nhận).

---

## Tổng quan lộ trình

| Phase | Tên | Thời lượng ước tính | Milestone thanh toán |
|---|---|---|---|
| 0 | Discovery & Chốt scope | 3-5 ngày | 20% tạm ứng khi ký |
| 1 | Foundation (schema, auth, RBAC lite) | 1.5-2 tuần | — |
| 2 | Booking Core (lock, calendar, TTL) | 2 tuần | 25% khi demo booking flow |
| 3 | Payment (VNPay/Momo, IPN, đối soát) | 1.5-2 tuần | 25% khi thanh toán sandbox pass UAT |
| 4 | Guest UX (search, listing, checkout) | 2 tuần | — |
| 5 | Vận hành (housekeeping lite, báo cáo, hỗ trợ khai lưu trú) | 1-1.5 tuần | — |
| 6 | Hardening, UAT, Deploy, Bàn giao | 1 tuần | 30% khi golive + bàn giao |
| 7+ | Mở rộng (channel manager, escrow, dynamic pricing, e-KYC...) | báo giá riêng | hợp đồng mới |

Tổng MVP: **9-11 tuần** cho 1 dev làm với AI agent stack (Antigravity + Claude Code).
Nếu làm part-time sau giờ hành chính: nhân 1.8-2x.

---

## PHASE 0 — Discovery & Chốt Scope (3-5 ngày)

### Mục tiêu
Biến spec thành hợp đồng có ranh giới rõ, chặn scope creep từ gốc.

### Việc cần làm
- [ ] Họp khách 1 buổi: xác nhận số căn ban đầu, loại hình BĐS (nhà mặt đất /
      condotel / chung cư — QUAN TRỌNG vì rủi ro pháp lý khác nhau)
- [ ] Chốt danh sách role MVP (xem Phase 1 — không làm đủ 8 role ngay)
- [ ] Chốt phương thức thanh toán: VNPay + Momo (redirect flow). VietQR động
      (PayOS/Casso) để Phase 7 trừ khi khách yêu cầu ngay
- [ ] Viết PRD rút gọn (2-3 trang, ngôn ngữ khách hiểu được) + Non-goals rõ ràng
- [ ] **Điều khoản pháp lý trong hợp đồng:** website hỗ trợ xuất dữ liệu khai báo
      lưu trú; trách nhiệm khai báo và tuân thủ Luật Nhà ở/Luật Cư trú thuộc về
      chủ cơ sở; khuyến nghị khách tham vấn luật sư nếu kinh doanh trên căn hộ
      chung cư thương mại
- [ ] Khách ký PRD + thanh toán tạm ứng 20%

### Non-goals MVP (ghi vào hợp đồng)
- Channel Manager đồng bộ Airbnb/Booking.com (Phase 7 — lý do: cần
  Channex/Rentals United, chi phí subscription riêng)
- Escrow wallet + auto-refund qua Payout API (Phase 7 — cần thỏa thuận
  pháp lý với cổng thanh toán, không phải thuần kỹ thuật)
- e-KYC quét CCCD + liveness (Phase 7 — cần vendor eKYC như VNPT/FPT.AI, chi phí per-call)
- Generative UI / AI adaptive interface (nice-to-have, không phải core value)
- Mobile app native
- Đặt phòng theo giờ (hourly) — MVP chỉ Daily + Overnight; hourly thêm ở Phase 7
  (multi-slot phức tạp hóa lock logic đáng kể)
- Smart lock integration (gửi PIN qua Zalo OA)

### Deliverable
PRD ký + hợp đồng + timeline. **Gate: chưa ký chưa code.**

---

## PHASE 1 — Foundation (1.5-2 tuần)

### Mục tiêu
Nền móng multi-tenant đúng từ đầu — phần đắt nhất nếu phải sửa sau.

### Kiến trúc dữ liệu (PostgreSQL)
```
organizations (tenant gốc — mỗi chủ nhà/công ty 1 org)
  └── properties (căn/homestay)
        └── room_types
              └── rooms (đơn vị bán)
users + roles + user_org_roles (RBAC theo org)
bookings (status: pending / confirmed / checked_in / checked_out / cancelled / expired)
payments (gắn 1-1 với booking, status riêng)
ledger_entries (sổ cái kép — thiết kế bảng từ Phase 1, dùng thật từ Phase 3)
audit_logs
```

### RBAC — MVP chỉ 4 role (không phải 8)
| Role MVP | Gộp từ spec gốc | Lý do |
|---|---|---|
| Guest/Member | Guest + Member | Guest checkout là bắt buộc; member là guest có tài khoản |
| Staff | Receptionist + Housekeeping | Ít nhân sự giai đoạn đầu; tách quyền chi tiết ở Phase 5/7 |
| Owner | Owner/Host + Accountant | Chủ nhà nhỏ tự làm kế toán; tách khi lên multi-host |
| Admin | Admin/Super Admin | Đủ dùng |

Thiết kế bảng roles **hỗ trợ mở rộng lên 8 role** (permission-based, không
hardcode if-else theo role name) — nhưng chỉ seed 4.

### Việc cần làm
- [ ] Setup repo, CI (lint + test tự động), môi trường dev/staging
- [ ] Schema + migration đầy đủ (kể cả ledger_entries để trống)
- [ ] Auth (email/password + OTP hoặc social login tùy khách), session, RBAC middleware
- [ ] Property CRUD + upload ảnh (S3-compatible storage)
- [ ] Admin skeleton (layout, navigation, phân quyền menu theo role)

### Phân công agent (Forge)
- Claude Code: schema, migration, RBAC middleware, auth
- Antigravity: admin skeleton UI
- Stitch: mockup admin layout trước khi Antigravity code

### Definition of Done
- Tạo được org → property → room type → room qua admin UI
- Test RBAC: staff không truy cập được trang doanh thu (viết test tự động)

---

## PHASE 2 — Booking Core (2 tuần) ⭐ XƯƠNG SỐNG

### Mục tiêu
Booking flow chống double-booking, chưa cần thanh toán thật.

### Kiến trúc lock 2 tầng (theo spec đã verify)
**MVP dùng PostgreSQL làm cả 2 tầng — Redis để Phase 7:**

1. **Tầng 1 — Soft hold:** Khách bấm "Đặt ngay" → INSERT booking
   `status=pending, expires_at=now()+15 phút` trong transaction có
   `SELECT ... FOR UPDATE` trên các row availability liên quan.
   Phòng lập tức ẩn khỏi khách khác.
2. **Tầng 2 — Confirm:** IPN thanh toán về (Phase 3) → transaction chuyển
   `pending → confirmed`, dùng cột `version` (optimistic lock) chống ghi đè.
3. **Cron job mỗi phút:** expire các booking `pending` quá hạn → `expired`,
   nhả phòng.

**Vì sao chưa cần Redis/Redlock ở MVP:** với lưu lượng vài căn, vài chục
booking/ngày, Postgres row lock dư sức và ít điểm hỏng hơn (1 hệ thống thay vì 2).
Redis Redlock chỉ đáng khi concurrent booking cao (hàng trăm request/giây trên
cùng phòng) — thiết kế code có interface `LockService` để swap sau.

### Việc cần làm
- [ ] Availability calendar per room (query tính cả pending chưa hết hạn + confirmed)
- [ ] Booking API: create (with lock), cancel, expire cron
- [ ] Buffer dọn phòng: tự chèn khoảng đệm cấu hình được (mặc định 0 cho Daily,
      bật khi khách cần)
- [ ] Admin: xem danh sách booking, filter theo status/property, hủy thủ công,
      tạo booking thủ công (cho khách vãng lai đến quầy)
- [ ] Giá theo mùa đơn giản: bảng price_rules (ngày thường / cuối tuần / ngày lễ
      theo range) — dynamic pricing thuật toán để Phase 7

### Test bắt buộc (Tempering — không thương lượng)
- [ ] Race condition: 2 request đồng thời đặt cùng phòng cùng ngày → đúng 1 thành công
      (viết test tự động chạy song song, không test tay)
- [ ] TTL: booking pending quá 15 phút tự expire, calendar nhả ngày
- [ ] Booking thủ công của lễ tân không đè lên booking online đang pending

### Definition of Done
Demo cho khách: đặt phòng từ 2 browser cùng lúc, chỉ 1 thành công.
**→ Milestone 25%.**

---

## PHASE 3 — Payment (1.5-2 tuần) ⭐ XƯƠNG SỐNG

### Mục tiêu
Tiền vào đúng, booking confirm đúng, đối soát được.

### Luồng chuẩn (redirect flow — cả VNPay lẫn Momo)
```
Khách đặt → booking pending → tạo payment URL → redirect sang cổng
→ khách thanh toán → 2 đường về:
   (a) ReturnUrl: chỉ hiển thị UX "đang xác nhận..."
   (b) IPN (server-to-server): NGUỒN SỰ THẬT — verify chữ ký,
       đối chiếu số tiền + mã đơn, chuyển booking → confirmed,
       ghi ledger, gửi email/Zalo xác nhận
```

### Sổ cái kép (double-entry) — bật từ phase này
Mỗi thanh toán thành công ghi cặp bút toán:
```
Nợ:  Tiền chờ về từ cổng TT     | Có: Phải trả chủ nhà (giá phòng - hoa hồng)
                                 | Có: Doanh thu hoa hồng nền tảng
```
MVP một chủ = hoa hồng 0, nhưng ledger vẫn ghi — khi lên multi-host chỉ đổi
tỉ lệ, không đổi kiến trúc.

### Việc cần làm
- [ ] Tích hợp VNPay sandbox: build URL, ReturnUrl, IPN handler, verify checksum
- [ ] Tích hợp Momo Test: captureWallet flow, IPN, verify signature
      (timeout tối thiểu 30s theo docs Momo)
- [ ] Job đối soát: quét booking pending có payment "lơ lửng" (khách tắt tab) —
      query trạng thái giao dịch qua API cổng, tự sửa status
- [ ] Refund thủ công qua admin (auto-refund API để Phase 7)
- [ ] Ledger entries + trang đối soát đơn giản cho Owner

### Test bắt buộc
- [ ] Thanh toán thành công / thất bại / khách tắt tab giữa chừng (IPN vẫn confirm đúng)
- [ ] IPN đến 2 lần (cổng retry) → idempotent, không ghi ledger đôi
- [ ] IPN sai chữ ký → reject + audit log
- [ ] Số tiền IPN ≠ số tiền booking → không confirm, đánh cờ cho admin

### Definition of Done
UAT sandbox với khách chứng kiến cả 3 kịch bản. **→ Milestone 25%.**

Lưu ý vận hành: đăng ký merchant VNPay/Momo production cần hồ sơ doanh nghiệp
của KHÁCH và thời gian duyệt — **bắt đầu thủ tục ngay từ Phase 0**, đừng đợi
Phase 3 mới làm (đây là critical path ngoài tầm kiểm soát dev).

---

## PHASE 4 — Guest UX (2 tuần)

### Mục tiêu
Mặt tiền bán hàng: đẹp, nhanh, SEO tốt.

### Việc cần làm
- [ ] Trang chủ + trang tìm kiếm: filter ngày/số khách/khu vực,
      **map-first search** (pin giá trên bản đồ — dùng Mapbox/Google Maps)
- [ ] Trang chi tiết property: gallery, tiện nghi, calendar trống, review placeholder
- [ ] **Guest checkout 3 bước:** chọn ngày → thông tin khách → thanh toán.
      Không bắt tạo tài khoản. Giá cuối minh bạch (gồm mọi phụ phí) hiện từ bước 1
- [ ] Trang quản lý chuyến đi cho Member (xem lịch sử, tự hủy theo chính sách)
- [ ] SEO: SSR/SSG với Next.js, meta tags + schema.org markup (LodgingBusiness)
      per property, LCP < 2.5s
- [ ] Responsive 3 viewport (375 / 768 / 1440)

### Phân công agent
- Stitch: 2 variant design cho listing + detail + checkout → khách chọn 1
- Antigravity: implement, tự browser-verify 3 viewport
- Claude Code: API search (Phase MVP dùng Postgres full-text + index;
  Elasticsearch để Phase 7 khi >100 property)

### Ghi chú thiết kế
Spec gốc đề "Tactile Maximalism + Bento Grid" — coi đây là **gợi ý direction,
không phải yêu cầu**. Đưa cho khách 2 variant từ Stitch (1 theo hướng đó,
1 minimal truyền thống) và để khách quyết. Không tự quyết thẩm mỹ thay khách.

### Definition of Done
Khách đặt phòng end-to-end từ mobile thật, thanh toán sandbox, nhận email xác nhận.

---

## PHASE 5 — Vận hành (1-1.5 tuần)

### Mục tiêu
Đủ công cụ cho vận hành hằng ngày của chủ nhà nhỏ.

### Việc cần làm
- [ ] Check-in/check-out trên admin (Staff role): đổi status, thu tiền mặt tại quầy
      (ghi ledger loại cash)
- [ ] Housekeeping lite: danh sách phòng cần dọn hôm nay (tự sinh từ lịch
      check-out), đánh dấu đã dọn, báo sự cố kèm ảnh. Staff role chỉ thấy
      trang này — không thấy doanh thu
- [ ] **Hỗ trợ khai báo lưu trú (thay cho "auto-submit C06" đã loại bỏ):**
      màn hình xuất danh sách khách lưu trú trong ngày (họ tên, ngày sinh,
      số định danh/hộ chiếu, thời gian lưu trú) dạng chuẩn để chủ nhà
      copy/nhập vào VNeID / Cổng DVC / phần mềm ASM. Nhắc nhở tự động
      (email/Zalo) trước 21h hằng ngày nếu có khách check-in chưa xuất báo cáo
      — deadline pháp lý là trước 23h ngày bắt đầu lưu trú
- [ ] Báo cáo Owner: doanh thu theo tháng/property, tỷ lệ lấp đầy, danh sách
      giao dịch đối soát
- [ ] Lưu trữ thông tin định danh khách: mã hóa at-rest, TLS in-transit,
      quyền truy cập theo role, thời hạn lưu + xóa theo yêu cầu — tuân thủ
      Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 (hiệu lực 1/1/2026).
      Ghi rõ trong privacy policy trang web

### Definition of Done
Chạy thử 1 chu kỳ vận hành đầy đủ: booking → check-in → xuất báo cáo lưu trú →
check-out → phòng vào danh sách dọn → báo cáo doanh thu khớp ledger.

---

## PHASE 6 — Hardening, UAT & Bàn giao (1 tuần)

### Việc cần làm
- [ ] Security pass: rate limiting, CSRF, input validation, kiểm tra lại toàn bộ
      endpoint theo RBAC, audit log các thao tác nhạy cảm
- [ ] Load test nhẹ: 50 concurrent user trên search + booking
- [ ] Backup tự động DB + quy trình restore (test restore thật 1 lần)
- [ ] Chuyển payment sang production credential (đã đăng ký từ Phase 0),
      UAT production với giao dịch thật số tiền nhỏ + refund thử
- [ ] UAT tổng với khách theo checklist ký nhận
- [ ] **Bàn giao 2 bộ tài liệu:**
      1. Cho khách (non-dev): hướng dẫn dùng admin bằng hình ảnh, xử lý tình
         huống thường gặp (khách báo đã chuyển tiền nhưng chưa confirm → làm gì),
         quy trình khai báo lưu trú hằng ngày
      2. Kỹ thuật (cho chính mình + dev sau này): /docs/booking-lock.md,
         /docs/payment-flow.md, /docs/ledger.md, runbook sự cố
- [ ] Thỏa thuận bảo trì sau golive (khuyến nghị: 1 tháng warranty fix bug miễn
      phí, sau đó gói bảo trì tháng)

### Definition of Done
Golive + khách ký biên bản nghiệm thu. **→ Milestone 30% cuối.**

---

## PHASE 7+ — Mở rộng (hợp đồng riêng, thứ tự khuyến nghị)

Khi khách "muốn mở rộng ra nhiều căn" thật sự xảy ra, chào theo thứ tự ROI:

1. **Channel Manager qua API** (Channex/Rentals United) — giá trị cao nhất khi
   khách bắt đầu list trên Airbnb/Booking.com. iCal có độ trễ tới nhiều giờ
   (có nguồn nêu tới 12h) → không dùng iCal làm giải pháp chính, chỉ làm fallback
2. **VietQR động** (PayOS/Casso) — giảm phí giao dịch so với cổng, UX quét mã nhanh
3. **Redis distributed lock** — khi lưu lượng thật sự cần (đã có interface sẵn)
4. **Dynamic pricing** nâng cao + **Elasticsearch** search
5. **Escrow + auto-refund qua Payout API** — cần làm việc pháp lý với cổng thanh toán
6. **e-KYC CCCD + liveness** (vendor VNPT eKYC / FPT.AI) — khi khách muốn
   self-check-in không người trực
7. **Tách role đầy đủ 8 role** + multi-host commission
8. **Đặt theo giờ (hourly/overnight multi-slot)** + time-boxing housekeeping tự động
9. Smart lock + Zalo OA PIN delivery

---

## RỦI RO & GIẢM THIỂU

| Rủi ro | Mức | Giảm thiểu |
|---|---|---|
| Merchant production VNPay/Momo duyệt chậm | Cao | Bắt đầu thủ tục từ Phase 0; sandbox không chặn tiến độ dev |
| Khách kinh doanh trên chung cư thương mại → vướng Luật Nhà ở 2023 | Cao (ngoài tầm dev) | Điều khoản hợp đồng Phase 0; khuyến nghị tham vấn luật sư; không nhận trách nhiệm pháp lý thay khách |
| Double-booking lọt lưới | Trung | Test race tự động Phase 2, chạy lại trong CI mỗi lần merge |
| IPN sự cố (cổng retry/miss) | Trung | Idempotency key + job đối soát chủ động Phase 3 |
| Scope creep ("thêm cái này tí thôi") | Cao | Non-goals trong hợp đồng; mọi thay đổi → change request có giá |
| Chủ quan phần bàn giao (khách không biết dùng) | Trung | Tài liệu non-dev + 1 buổi training có ghi hình |

---

## MAP VÀO FORGE WORKFLOW

| Giai đoạn Forge | Áp vào dự án này |
|---|---|
| Quarry | Đã xong: docs VNPay/Momo/luật đã verify — nạp vào NotebookLM dự án |
| Anvil | Phase 0: PRD + task breakdown bằng Claude Code Plan Mode (Prompt #3) |
| Forge | Phase 1-5: Claude Code (backend/lock/payment) ∥ Antigravity (UI) ∥ Stitch (design) — mỗi phase lặp lại chu trình |
| Tempering | Cuối mỗi phase: test bắt buộc trong Definition of Done, không skip |
| Archive | Phase 6: /docs + nạp ngược NotebookLM + Audio Overview nghe trước khi gặp khách nghiệm thu |
