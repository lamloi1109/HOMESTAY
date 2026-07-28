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

## Component đã kéo về

Nằm ở `frontend/src/components/gaoji/`. **Khác với token, đây là bản CHUYỂN chứ
không phải bản sao** — đã đổi sang TypeScript, JSX thay cho `React.createElement`,
và thêm `"use client"` cho component có trạng thái hover/press.

| Component | Ghi chú |
| --- | --- |
| `interactions.ts` | `useTactile`, `tactileTransform` |
| `Icon.tsx` | **Đổi nhiều nhất** — xem phần dưới |
| `Badge.tsx`, `RatingStars.tsx`, `RoomSpecs.tsx` | Không có trạng thái nên render được ở server |
| `IconButton.tsx`, `Card.tsx`, `PropertyCard.tsx` | Client component (hover/press) |

### Icon đổi gì

Bản gốc nạp Lucide từ CDN rồi bơm SVG bằng `innerHTML` trong `useEffect`. Trong
Next.js cách đó làm server render ra thẻ rỗng — Google không thấy icon, mà trang
này sống bằng SEO. Bản trong repo dùng `lucide-react` (đã có sẵn theo D-006) với
một `REGISTRY` liệt kê tay từng icon để bundle không phải gánh cả bộ. Giao diện
prop giữ nguyên (`name` kebab-case) nên component khác không phải sửa.

Icon chưa đăng ký thì **không vẽ gì** và cảnh báo ở chế độ dev — thà thiếu còn
hơn vẽ nhầm glyph khác nghĩa. Cần icon mới thì thêm vào `REGISTRY`.

### Lỗi phát hiện ở bản gốc

`components/travel/PropertyCard.jsx` dùng `var(--clay-300)` cho gradient thứ ba,
nhưng bảng màu không có `--clay-300` (chỉ 50/100/200/400/500/600/700) nên gradient
đó hỏng. Bản trong repo tạm thay bằng `--clay-400`. **Cần sửa trên design system.**

## Chưa kéo về

- `components/` phần còn lại — `Button`, `SearchBar`, `TopNav`, `Input`, `Stepper`,
  `Tag`, `BentoGrid`, `ThemeToggle`, `LanguageSwitcher`, `ReservationCard`.
- `ui_kits/guest-web` — Home, Listing, Checkout. Dùng làm bản tham chiếu bố cục.
- `ui_kits/owner-console` — Dashboard, Bookings, báo cáo lưu trú.
- `guidelines/` — thẻ đặc tả nền tảng (màu, chữ, khoảng cách).

## Lưu ý phạm vi

Design system được dựng cho một OTA đặt phòng trực tuyến đầy đủ (có checkout,
thanh toán, "xác nhận tức thì"). Phạm vi sản phẩm hiện tại nhỏ hơn thế. Phần
token và component nền thì dùng chung được; phần màn hình liên quan tới thanh
toán thì chưa.
