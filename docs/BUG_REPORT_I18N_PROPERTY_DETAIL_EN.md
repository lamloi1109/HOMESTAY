# [i18n][UI] Nội dung trang chi tiết căn hộ không chuyển hoàn toàn sang Tiếng Anh khi chọn EN

## 1. Tiêu đề lỗi (Bug Title)

**[i18n][UI] Nội dung trang chi tiết căn hộ không chuyển hoàn toàn sang Tiếng Anh khi chọn EN**

## 2. Mức độ nghiêm trọng (Severity)

**High / Major (S2)**

Người dùng quốc tế vẫn nhìn thấy nhiều chuỗi Tiếng Việt trong phần thông tin
chính của căn hộ mặc dù `EN` đang được kích hoạt. Lỗi ảnh hưởng trực tiếp đến
khả năng hiểu loại căn hộ, vị trí, sức chứa, trạng thái cho thuê và CTA liên hệ/
đặt phòng; tuy nhiên trang vẫn hiển thị và các thành phần điều hướng vẫn có thể
sử dụng.

## 3. Các bước tái hiện (Steps to Reproduce)

1. Truy cập website Gao Ji House.
2. Mở trang chi tiết căn hộ **Gaoji Park 1 — Căn 27.10**.
3. Trên thanh điều hướng, chọn ngôn ngữ **EN**.
4. Xác nhận nút **EN** đang ở trạng thái được kích hoạt.
5. Quan sát phần tiêu đề, mô tả vị trí, trạng thái, thông số căn hộ và CTA ở
   vùng đầu trang.

## 4. Kết quả thực tế (Actual Result) và Kết quả mong đợi (Expected Result)

### Actual Result

- Thanh điều hướng hiển thị bằng Tiếng Anh và nút `EN` đang active.
- Nhiều chuỗi thuộc nội dung chi tiết căn hộ vẫn hiển thị bằng Tiếng Việt hoặc
  dùng chữ viết tắt Tiếng Việt, tạo giao diện trộn hai ngôn ngữ.
- CTA chính ở cạnh phải vẫn hiển thị bằng Tiếng Việt.

### Expected Result

- Khi `EN` được chọn, toàn bộ chuỗi giao diện thuộc trang chi tiết căn hộ phải
  lấy bản dịch Tiếng Anh tương ứng.
- Tên riêng như `Gaoji Park 1`, `Vinhomes Central Park` và `Landmark 81` được
  giữ nguyên; các danh từ giao diện, mô tả, trạng thái, thông số và CTA phải
  chuyển sang Tiếng Anh.
- Không còn chuỗi Tiếng Việt hoặc chữ viết tắt Tiếng Việt trong vùng giao diện
  đang hiển thị.

## 5. Bảng thống kê chuỗi chưa dịch

| Vị trí / Thành phần | Văn bản Tiếng Việt hiện tại | Văn bản Tiếng Anh mong đợi (Gợi ý dịch) |
|---|---|---|
| Danh mục phía trên tiêu đề | `CĂN HỘ DỊCH VỤ CAO CẤP · VINHOMES CENTRAL PARK` | `PREMIUM SERVICED APARTMENT · VINHOMES CENTRAL PARK` |
| Tên căn hộ | `GAOJI PARK 1 — CĂN 27.10` | `GAOJI PARK 1 — UNIT 27.10` |
| Mô tả tòa nhà, tầng và hướng nhìn | `Toà Park 1 · Tầng 27 · Trực diện Công viên 14ha & Cầu Sài Gòn` | `Park 1 Tower · Floor 27 · Direct View of the 14-hectare Park & Saigon Bridge` |
| Tag trạng thái | `SẴN SÀNG CHO THUÊ` | `AVAILABLE FOR RENT` |
| Thông số phòng ngủ | `2 PN` | `2 BR` |
| Thông số phòng tắm | `2 WC` | `2 BATHS` |
| Thông số diện tích | `85 M²` | `85 M²` *(không cần đổi nội dung, nhưng phải dùng cùng key/formatter theo locale)* |
| Thông số sức chứa | `4 KHÁCH` | `4 GUESTS` |
| CTA nổi bên phải | `HỎI GIÁ / ĐẶT PHÒNG` | `REQUEST A QUOTE / BOOK NOW` |

> **Ghi chú phạm vi:** Nhãn vị trí `0.2 KM · LANDMARK 81` và các mục điều
> hướng `APARTMENTS & RATES`, `LOCATION`, `AMENITIES`, `FAQ` đã hiển thị bằng
> Tiếng Anh trong ảnh nên không được ghi nhận là chuỗi chưa dịch.
