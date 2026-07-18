# Kiến trúc Hệ thống OTA Homestay Thế hệ mới

> **Phiên bản:** 1.0 — 2026-07-17
> **Tác giả:** Fable 5 (Orchestrator)
> **Trạng thái:** Bản thiết kế nền cho Task Decomposition ở `.coordination/TASKS.md`. Mọi thay đổi kiến trúc phải log vào `.coordination/DECISIONS.md`.

---

## 1. Tổng quan hệ thống

**Bài toán:** Nền tảng OTA cho homestay Việt Nam, 3 cam kết cứng:
1. **Không overbooking** — kể cả khi 2 khách bấm Book cùng lúc, hoặc booking đến từ OTA ngoài (Booking.com/Agoda) song song với booking nội bộ.
2. **Không giá ảo** — giá khách thấy lúc quote = giá lúc thanh toán; server không bao giờ tin giá do client gửi lên.
3. **Tuân thủ pháp lý** — khai báo lưu trú C06 (VNeID) đúng hạn, dữ liệu e-KYC mã hóa và quản lý theo Nghị định 13/2023 (PDPL) + QĐ 19/2026.

**Stack (frozen — xem D-001):**

| Tầng | Công nghệ | Vai trò |
|---|---|---|
| Frontend + BFF | Next.js 15 App Router (TypeScript) | UI Bento Grid, Server Actions/Route Handlers làm API |
| CSDL chính | PostgreSQL 16 | Source of truth: bookings, inventory, users, e-KYC ciphertext |
| Cache + Lock | Redis 7 (3 node cho Redlock) | Distributed lock, quote cache, hold TTL, rate limit |
| Event bus | Kafka | Sự kiện booking/inventory → sync OTA, notification, C06 queue |
| Thanh toán | PayOS | Payment link + webhook |
| e-KYC | Provider chính + provider phụ (chọn ở T-010) | OCR/NFC CCCD |

**Nguyên tắc kiến trúc xuyên suốt (defense in depth):** Redis Redlock là *cổng điều phối* (giảm tranh chấp, giữ throughput), nhưng **bảo chứng cuối cùng chống overbooking là ràng buộc ở PostgreSQL** (EXCLUDE constraint). Nếu Redlock hỏng (clock drift, failover), hệ thống chậm đi chứ không sai. Xem D-002.

---

## 2. Luồng dữ liệu chính: từ nút "Book" đến khóa Redlock và ghi DB

### 2.1. Giai đoạn Quote (chống giá ảo)

1. Khách chọn phòng + khoảng ngày → client gọi `POST /api/quotes`.
2. Server tính giá **từ DB** (`rate_plans` + `pricing_rules` + phụ phí + khuyến mãi), tạo `quote_id`, lưu vào Redis:
   - Key: `quote:{quote_id}` → `{room_type_id, check_in, check_out, total_amount, currency, breakdown_hash}`
   - TTL: **10 phút**.
3. Trả về client: `quote_id` + breakdown giá. Client **không bao giờ** gửi lại số tiền — chỉ gửi `quote_id`.

### 2.2. Giai đoạn Book (Redlock + ghi DB)

Endpoint: `POST /api/bookings` (Route Handler, chạy trên Node runtime — không Edge, vì cần Redis client đầy đủ).

Trình tự chi tiết:

1. **Xác thực & validate:** session hợp lệ, payload qua Zod schema, `quote_id` còn sống trong Redis. Quote hết hạn → 410, client phải quote lại (giá có thể đã đổi — đây chính là cơ chế chống giá ảo).
2. **Acquire Redlock:**
   - Key: `lock:inv:{room_type_id}:{check_in}:{check_out}` (chuẩn hóa ngày ISO).
   - TTL lock: **5 giây**; retry tối đa 3 lần, backoff 200ms + jitter.
   - Thất bại sau retry → HTTP 409 `ROOM_CONTENDED`, client hiện "Phòng đang được người khác giữ, thử lại sau ít giây". **Không** xếp hàng chờ vô hạn.
3. **Trong critical section — một transaction PostgreSQL duy nhất:**
   ```sql
   BEGIN;
   -- (a) Khóa dòng tồn kho của từng đêm
   SELECT date, available FROM room_inventory
   WHERE room_type_id = $1 AND date >= $check_in AND date < $check_out
   FOR UPDATE;
   -- (b) Nếu bất kỳ đêm nào available <= 0 → ROLLBACK, trả 409 SOLD_OUT
   -- (c) Trừ tồn kho từng đêm
   UPDATE room_inventory SET available = available - 1 WHERE ...;
   -- (d) Ghi booking trạng thái chờ thanh toán
   INSERT INTO bookings (id, room_type_id, guest_id, check_in, check_out,
                         total_amount, quote_id, status, hold_expires_at)
   VALUES (..., 'pending_payment', now() + interval '15 minutes');
   COMMIT;
   ```
   - Lưới an toàn tầng DB: bảng `booking_stays(room_id, stay daterange)` có `EXCLUDE USING gist (room_id WITH =, stay WITH &&)` (extension `btree_gist`) — nếu mọi tầng trên đều thủng, INSERT trùng lịch vẫn fail ở đây.
4. **Release Redlock** (trong `finally` — kể cả khi transaction lỗi).
5. **Phát sự kiện Kafka** `booking.created` (outbox pattern — xem 2.4): consumer inventory-sync đẩy cập nhật tồn kho sang các OTA ngoài ngay lập tức để đóng phòng.
6. **Tạo PayOS payment link** với `orderCode = booking id`, số tiền lấy từ **DB**, trả `checkoutUrl` cho client.

### 2.3. Thanh toán và xác nhận

1. PayOS webhook → `POST /api/webhooks/payos`. **Verify chữ ký HMAC** trước mọi xử lý; sai chữ ký → 401 + log cảnh báo.
2. Idempotency: xử lý webhook theo `orderCode`, ghi bảng `webhook_events(event_id unique)` — webhook bắn trùng không tạo hiệu ứng kép.
3. Transaction: `bookings.status → 'confirmed'`, xóa `hold_expires_at`, outbox event `booking.confirmed`.
4. Consumer downstream: gửi email/Zalo xác nhận, lên lịch nhắc check-in (gắn với luồng e-KYC + C06).

### 2.4. Outbox pattern (chốt tính nhất quán DB ↔ Kafka)

Không publish Kafka trực tiếp trong request handler. Mỗi transaction ghi thêm dòng vào bảng `outbox_events`; một relay worker (poll 200ms hoặc Debezium sau này) đọc outbox → publish Kafka → đánh dấu đã gửi. Đảm bảo: **DB commit thì event chắc chắn ra**, DB rollback thì event không bao giờ ra.

### 2.5. Nhả giữ chỗ khi không thanh toán

- Sweeper cron (chạy mỗi phút): `UPDATE bookings SET status='expired' WHERE status='pending_payment' AND hold_expires_at < now()` + hoàn tồn kho + outbox event `booking.expired`.
- Chọn cron sweeper thay vì Redis keyspace notification làm cơ chế chính vì keyspace notification là best-effort (mất event khi Redis restart). Redis TTL chỉ dùng làm tín hiệu "nhả sớm" để UX tốt hơn.

### 2.6. Sơ đồ tuần tự (tóm tắt)

```mermaid
sequenceDiagram
    participant G as Khách (Browser)
    participant N as Next.js API
    participant R as Redis (Redlock)
    participant P as PostgreSQL
    participant K as Kafka
    participant Pay as PayOS

    G->>N: POST /api/bookings {quote_id}
    N->>R: GET quote:{id} (validate giá)
    N->>R: Redlock acquire lock:inv:...
    R-->>N: OK (TTL 5s)
    N->>P: BEGIN; SELECT FOR UPDATE; UPDATE inventory; INSERT booking + outbox; COMMIT
    N->>R: Redlock release
    P-->>K: outbox relay → booking.created
    N->>Pay: create payment link
    N-->>G: checkoutUrl (hold 15 phút)
    Pay->>N: webhook (HMAC verified)
    N->>P: booking → confirmed + outbox
    P-->>K: booking.confirmed
```

---

## 3. Đồng bộ Channel Manager (chống overbooking đa kênh)

1. **Chiều đẩy (push):** consumer của `inventory.updated` gọi API từng OTA connector (Booking.com, Agoda, Airbnb) với idempotency key = `{event_id}:{ota}`; retry exponential backoff; lỗi quá 5 lần → dead-letter topic + cảnh báo host.
2. **Chiều kéo (reconciliation):** job 15 phút/lần pull toàn bộ reservation từ OTA, so khớp với DB. Booking ngoài về trước → trừ tồn kho nội bộ (đi qua đúng critical section ở 2.2, coi OTA như một "khách").
3. **Xung đột thật (double-sell hai kênh trong khe đồng bộ):** không thể loại trừ 100% với OTA bên ngoài — thiết kế **quy trình relocate**: hệ thống phát hiện xung đột → tự đề xuất phòng thay thế cùng hạng ± nâng hạng → notify host quyết định trong SLA 30 phút. Đây là quy trình vận hành, không phải im lặng hủy khách.

---

## 4. e-KYC: mã hóa và phương án dự phòng

### 4.1. Mã hóa (envelope encryption)

- Mỗi bản ghi giấy tờ khách: sinh **data key** ngẫu nhiên 256-bit → mã hóa payload PII bằng **AES-256-GCM** (nonce 96-bit duy nhất/bản ghi, auth tag lưu kèm).
- Data key được wrap bằng **master key** giữ trong KMS (khởi đầu: biến môi trường trên server riêng + rotation thủ công có quy trình; nâng cấp lên Cloud KMS/Vault khi lên production — quyết định ở D-004).
- DB chỉ lưu: `ciphertext`, `nonce`, `auth_tag`, `wrapped_key`, `key_version`. Ảnh giấy tờ lưu object storage cũng mã hóa cùng cơ chế.
- **Mọi lần giải mã đều ghi audit log** (`who, khi nào, booking nào, lý do`). Retention: tự động xóa theo thời hạn quy định; API "xóa dữ liệu của tôi" cho khách (PDPL).

### 4.2. Fallback chain — luồng check-in không bao giờ bị chặn

Nguyên tắc: **check-in của khách không phụ thuộc vào uptime của bên thứ ba.** Trạng thái xác minh tách khỏi trạng thái check-in.

```
Tầng 1: Provider eKYC chính (OCR/NFC CCCD)
   │  lỗi/timeout 5s hoặc circuit breaker OPEN (≥50% lỗi trong 1 phút)
   ▼
Tầng 2: Provider eKYC phụ (API tương thích qua adapter interface chung)
   │  cũng lỗi
   ▼
Tầng 3: Manual mode — host chụp ảnh giấy tờ + nhập tay 5 trường bắt buộc
         → bản ghi gắn cờ verification_status='pending'
         → job vào Kafka topic `ekyc.pending`
   ▼
Retry nền: worker tự re-verify qua provider khi circuit breaker đóng lại.
         Quá 24h chưa verify được → cảnh báo host xử lý tay.
```

Ba tầng cùng một interface `EkycProvider { extract(doc): GuestIdentity }` — UI check-in không biết đang chạy tầng nào, chỉ hiện trạng thái.

---

## 5. Khai báo lưu trú C06 (VNeID)

Thiết kế 2 kênh, ưu tiên kênh chính thức (D-003):

- **Kênh 1 (chính): API/kết nối chính thức** mà cơ sở lưu trú được cấp khi đăng ký với cơ quan quản lý (mô hình ASM). Structured data từ e-KYC → payload khai báo → gửi, lưu mã biên nhận.
- **Kênh 2 (dự phòng): RPA bot Playwright** điền form trên cổng từ cùng structured data. **Ranh giới cứng:** bot dừng và yêu cầu host thao tác khi gặp đăng nhập VNeID/OTP/CAPTCHA — không tự động hóa bước định danh, không né bot-detection. Bot chỉ thay việc gõ tay lặp lại.
- **Hàng đợi + SLA:** mọi khai báo vào topic `c06.declarations`; worker xử lý tuần tự; chưa có xác nhận trước **21:00 cùng ngày** (đệm 2h trước hạn 23:00) → đẩy cảnh báo cho host kèm link khai tay + dữ liệu đã điền sẵn để copy. Trạng thái từng khai báo hiển thị trong dashboard host: `queued / submitted / confirmed / needs_human`.

---

## 6. Ranh giới module & sơ đồ phụ thuộc

```
M7 DB Schema ──┬─→ M2 Booking Core (Redlock + transaction)  [Fable thiết kế + review dòng lock]
               ├─→ M3 PayOS                                  [Sonnet]
               ├─→ M4 e-KYC Service                          [Fable: crypto core; Sonnet: CRUD/UI quanh nó]
               └─→ M6 Channel Sync                           [Sonnet]
M1 UI (Bento)  ──→ gọi M2/M3 qua API contract                [Sonnet]
M5 C06 Bot     ──→ đọc output M4                             [Fable: state machine; Sonnet: script Playwright]
M8 Notification──→ consume Kafka events                      [Sonnet/Haiku]
```

API contract giữa UI và backend chốt bằng file OpenAPI/Zod schema trong `packages/contracts` — hai bên code song song không đợi nhau.
