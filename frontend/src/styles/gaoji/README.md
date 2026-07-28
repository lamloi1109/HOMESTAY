# Gaoji House — design tokens

Bản sao token của design system **Gaoji House** trên claude.ai/design.

- **Project ID:** `5c995ee4-97d7-49ab-9cb1-cc0a72096d37`
- **Kéo về:** 2026-07-28
- **Nguồn sự thật về thiết kế:** design system trên claude.ai/design, không phải thư mục này.

## Quy tắc

Các file dưới đây là **bản sao nguyên văn** của `tokens/*.css` trên design system.
Đừng sửa tay — sửa trên claude.ai/design rồi kéo lại, để lần đồng bộ sau còn so
sánh được sạch sẽ.

| File | Nội dung |
| --- | --- |
| `colors.css` | Bảng màu Cloud Dancer + Clay (chính) + Jade (phụ) + màu chức năng, kèm dark mode |
| `typography.css` | Cormorant Garamond (tiêu đề) + Be Vietnam Pro (thân), thang cỡ chữ |
| `spacing.css` | Nhịp 4px, container, lưới Bento 12 cột |
| `radius.css` | Bo góc mềm kiểu claymorphic |
| `elevation.css` | Đổ bóng claymorphic, `--shadow-clay` là chữ ký thương hiệu |
| `effects.css` | Lớp grain (nhiễu) + chuyển động spring |
| `base.css` | Reset tối thiểu, class tiện ích `.gh-*` |

Ngoại lệ duy nhất: **`next-adapter.css`** — file tự viết, trỏ token font sang
biến của `next/font`. Lý do ghi trong chính file đó.

## Đồng bộ lại

Trong Claude Code:

```
Đọc lại token từ design system Gaoji House và cập nhật frontend/src/styles/gaoji/
```

Claude đọc thẳng project qua công cụ DesignSync — không cần export hay tải file tay.

## Chưa kéo về

Design system còn nhiều thứ chưa mang sang, chỉ kéo khi thật sự cần tới:

- `components/` — thư viện React (Button, Card, SearchBar, PropertyCard, …).
  Viết bằng React thuần + style nội tuyến trỏ vào biến CSS, không dùng Tailwind
  nên không xung đột. Kéo từng cái, nhớ thêm `"use client"`.
- `ui_kits/guest-web` — Home, Listing, Checkout. Dùng làm bản tham chiếu bố cục.
- `ui_kits/owner-console` — Dashboard, Bookings, báo cáo lưu trú.
- `guidelines/` — thẻ đặc tả nền tảng (màu, chữ, khoảng cách).

## Lưu ý phạm vi

Design system được dựng cho một OTA đặt phòng trực tuyến đầy đủ (có checkout,
thanh toán, "xác nhận tức thì"). Phạm vi sản phẩm hiện tại nhỏ hơn thế. Phần
token và component nền thì dùng chung được; phần màn hình liên quan tới thanh
toán thì chưa.
