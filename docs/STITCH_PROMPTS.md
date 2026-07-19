# Prompt Google Stitch — Mockup từng trang cho khách xem

> **Mục đích:** tạo mockup UI nhanh bằng [Google Stitch](https://stitch.withgoogle.com)
> để demo cho khách trong buổi họp chốt PRD (Phase 0). Đây là **mockup minh họa**,
> không phải thiết kế final — dựa trên PRD nháp v0.1 (2026-07-18).
>
> **Cách dùng:**
> 1. Tạo **1 project duy nhất** trong Stitch, chọn chế độ **Mobile** trước
>    (khách đặt phòng chủ yếu từ điện thoại — đúng success criteria PRD:
>    "đặt phòng end-to-end từ mobile thật"). Có thể generate thêm bản Web sau.
> 2. Paste **prompt số 0 (theme)** trước tiên để cả bộ màn hình đồng bộ style.
> 3. Sau đó paste lần lượt từng prompt bên dưới, mỗi prompt = 1 màn hình.
> 4. Prompt viết tiếng Anh (Stitch hiểu tiếng Anh ổn định hơn), nhưng đã chỉ
>    định **text trên UI là tiếng Việt** để khách xem thấy thân thuộc.

---

## 0. Theme chung (paste đầu tiên, kèm prompt màn hình số 1)

```
Design a mobile app UI for a Vietnamese homestay direct-booking platform.
Style: warm and welcoming hospitality brand. Primary color: warm terracotta
or deep teal (pick one and keep consistent). Rounded cards, soft shadows,
generous whitespace, large touch targets. Font: clean modern sans-serif
with Vietnamese diacritics support. All UI text must be in Vietnamese.
Currency format: "1.200.000 ₫".
```

---

## 1. Trang chủ (Home)

```
Home screen for a homestay booking app, all text in Vietnamese.
Top: logo "Homestay" and a friendly greeting "Xin chào! Bạn muốn đi đâu?".
Hero search card with 3 fields: "Địa điểm" (location), "Nhận phòng — Trả phòng"
(date range), "Số khách" (guest count stepper), and a large primary button
"Tìm phòng".
Below: horizontal scroll section "Điểm đến nổi bật" with destination cards
(Đà Lạt, Vũng Tàu, Đà Nẵng, Hội An) showing photo and name.
Then section "Homestay được yêu thích" with property cards: photo, name,
location, star rating, price per night "từ 850.000 ₫/đêm".
Then a small section "Bài viết mới từ Blog" with 2 article thumbnails.
Bottom navigation bar: "Trang chủ", "Tìm kiếm", "Chuyến đi", "Blog", "Tài khoản".
```

## 2. Kết quả tìm kiếm + bộ lọc tiện ích (Search results)

```
Search results screen, Vietnamese text. Sticky top bar showing the current
search summary "Đà Lạt · 24–26/07 · 2 khách" with an edit icon.
Below it a horizontal filter chip row: "Lọc", "Giá", "Tiện ích", "Loại phòng",
"Sắp xếp". The "Tiện ích" chip is highlighted/active.
List of property result cards: large photo with a heart (save) icon, property
name, area/district, amenity icons row (kitchen, washing machine, parking,
wifi), rating badge like "4,8 (127)", price "950.000 ₫/đêm", and label
"Còn 2 phòng trống".
Also show an open bottom sheet titled "Lọc theo tiện ích" with grouped
checkboxes: group "Tiện nghi cơ bản" (Wifi, Điều hòa, Máy nước nóng),
group "Bếp" (Bếp riêng, Tủ lạnh, Máy giặt), group "Khác" (Bãi đỗ xe,
Ban công, Cho phép thú cưng), and buttons "Xóa lọc" and "Áp dụng (12)".
```

## 3. Chi tiết property (Property detail)

```
Property detail screen, Vietnamese text. Top: full-width photo gallery with
image counter "1/12" and back + share + heart icons overlaid.
Below: property name "Mộc Homestay Đà Lạt", location line with map pin,
rating "4,8 · 127 đánh giá".
Section "Tiện ích" showing amenities grouped with icons under group headers:
"Tiện nghi cơ bản" (Wifi, Điều hòa, TV), "Bếp" (Bếp riêng, Tủ lạnh, Máy giặt),
"Khác" (Bãi đỗ xe miễn phí, Ban công) and a link "Xem tất cả 18 tiện ích".
Section "Chọn phòng" listing room type cards: room photo, name "Phòng đôi
view vườn", max guests "2 khách", bed info "1 giường đôi", price
"850.000 ₫/đêm", and button "Chọn".
Section "Vị trí" with a small static map preview.
Sticky bottom bar: price "từ 850.000 ₫/đêm" on the left, primary button
"Đặt phòng" on the right.
```

## 4. Form đặt phòng (Booking form)

```
Booking summary screen before payment, Vietnamese text. Title "Xác nhận
đặt phòng". Card at top: property thumbnail, name "Mộc Homestay Đà Lạt",
room type "Phòng đôi view vườn".
Details list: "Nhận phòng: Th 6, 24/07/2026 — từ 14:00", "Trả phòng:
CN, 26/07/2026 — trước 12:00", "Số đêm: 2", "Khách: 2 người lớn".
Guest info form: "Họ và tên", "Số điện thoại", "Email", optional textarea
"Ghi chú cho chủ nhà".
Price breakdown card: "850.000 ₫ × 2 đêm = 1.700.000 ₫", "Phí dịch vụ:
0 ₫", divider, bold total "Tổng cộng: 1.700.000 ₫".
Info banner with clock icon: "Phòng sẽ được giữ trong 15 phút sau khi bấm
thanh toán".
Bottom primary button "Tiếp tục thanh toán".
```

## 5. Chọn phương thức thanh toán (Payment method)

```
Payment method screen, Vietnamese text. Title "Thanh toán".
Countdown banner at top: "Giữ phòng còn 14:32" with orange clock icon.
Order summary collapsed card: "Mộc Homestay Đà Lạt · 2 đêm · Tổng
1.700.000 ₫".
Payment options as selectable radio cards: "VNPay" with VNPay logo
placeholder and subtitle "Thẻ ATM / QR / Thẻ quốc tế", "Momo" with Momo
logo placeholder and subtitle "Ví điện tử Momo". VNPay option selected.
Checkbox "Tôi đồng ý với Điều khoản và Chính sách hủy phòng" with links.
Bottom primary button "Thanh toán 1.700.000 ₫".
Small note under button: "Bạn sẽ được chuyển đến cổng thanh toán an toàn".
```

## 6. Kết quả thanh toán (Payment success)

```
Payment success screen, Vietnamese text. Large green check icon in center.
Heading "Đặt phòng thành công!". Subtitle "Mã đặt phòng: HS-2607-0042.
Email xác nhận đã được gửi tới lamloi@example.com".
Booking detail card: property photo, "Mộc Homestay Đà Lạt", "Phòng đôi
view vườn", "24/07 — 26/07/2026 · 2 khách", "Đã thanh toán: 1.700.000 ₫
qua VNPay" with a green "Đã xác nhận" status badge.
Two buttons: primary "Xem chuyến đi của tôi", secondary "Về trang chủ".
```

## 7. Chuyến đi của tôi (Booking history — Member)

```
My trips screen, Vietnamese text. Title "Chuyến đi". Two tabs: "Sắp tới"
(active) and "Đã qua".
Upcoming trip card: property photo, name, dates "24/07 — 26/07/2026",
status badge "Đã xác nhận" in green, booking code "HS-2607-0042", buttons
"Xem chi tiết" and "Liên hệ chủ nhà".
Another card with status badge "Chờ thanh toán" in orange and countdown
"còn 12 phút", button "Thanh toán ngay".
Past trips tab shows a card with "Hoàn thành" gray badge and a button
"Đánh giá" .
Bottom navigation bar same as home screen, "Chuyến đi" tab active.
```

## 8. Blog — danh sách bài viết

```
Blog listing screen for the same homestay app, Vietnamese text. Title
"Blog du lịch". Category chip row: "Tất cả", "Kinh nghiệm du lịch",
"Khám phá Đà Lạt", "Khuyến mãi".
Featured article card at top: large photo, category tag, title "5 quán cà
phê view rừng thông đẹp nhất Đà Lạt", date and read time "12/07/2026 ·
5 phút đọc".
Then a list of smaller article cards (thumbnail left, title + date right).
Between the 2nd and 3rd article, insert a clearly-labeled ad placeholder
box: light gray box with border, small text "Quảng cáo" in the corner
(Google AdSense banner slot, 320x100).
Bottom navigation bar with "Blog" tab active.
```

## 9. Blog — chi tiết bài viết

```
Blog article detail screen, Vietnamese text. Cover photo at top with back
button. Category tag "Kinh nghiệm du lịch", article title "5 quán cà phê
view rừng thông đẹp nhất Đà Lạt", author + date line "Bởi Mộc Homestay ·
12/07/2026 · 5 phút đọc".
Article body: 2–3 paragraphs of Vietnamese placeholder text with one inline
photo. In the middle of the article, one ad placeholder box labeled
"Quảng cáo" (300x250 AdSense slot, light gray with border).
At the end: a promo card "Đặt phòng tại Mộc Homestay Đà Lạt" with photo,
price "từ 850.000 ₫/đêm" and button "Xem phòng" (internal cross-sell,
not an ad).
Related articles section "Bài viết liên quan" with 2 small cards.
```

## 10. Đăng nhập / Đăng ký (Login)

```
Login screen, Vietnamese text. Logo at top. Heading "Đăng nhập".
Fields: "Email hoặc số điện thoại", "Mật khẩu" with show/hide icon.
Link "Quên mật khẩu?". Primary button "Đăng nhập".
Divider "hoặc". Social button "Tiếp tục với Google".
Bottom text: "Chưa có tài khoản? Đăng ký ngay".
Note under form: "Bạn có thể đặt phòng không cần tài khoản" as a subtle
guest-checkout link.
```

---

## Ghi chú khi demo cho khách

- **Màn 2 & 3** demo trực tiếp câu hỏi PRD mục 7.3 (tiện ích chuẩn hóa có
  icon + filter theo nhóm) — cho khách thấy vì sao nên dùng danh mục chuẩn
  thay vì free-text.
- **Màn 8 & 9** demo câu hỏi PRD mục 7.2 (ads **chỉ ở blog**, có nhãn
  "Quảng cáo" rõ ràng, không xuất hiện ở search/property/checkout).
- **Màn 4 & 5** thể hiện rule giữ phòng 15 phút (success criteria PRD mục 2).
- Nếu khách muốn xem bản desktop: trong Stitch chọn lại chế độ **Web** và
  paste lại prompt tương ứng, thêm câu "Desktop web layout, max content
  width 1200px" vào đầu prompt.
- Sau khi khách chốt, có thể export từ Stitch sang Figma để tinh chỉnh, hoặc
  chỉ dùng screenshot làm phụ lục PRD.
