# Source images — Gao Ji House

Thư mục này dùng để nhận **ảnh gốc theo từng căn hộ** trước khi tối ưu và đưa vào website. Ảnh ở đây không được frontend phục vụ trực tiếp.

## Cách tải ảnh lên

Tải ảnh của mỗi căn vào đúng thư mục mã căn tương ứng:

```text
source-images/apartments/
├── L1.29.08/
├── P1.27.10/
├── L81.07.12/
├── P3.42.12/
└── L3.44.09/
```

Nếu có căn mới, tạo thêm thư mục theo đúng mã căn đang sử dụng trên website.

## Quy ước tên file

Không bắt buộc đổi tên trước khi upload. Nếu thuận tiện, dùng thứ tự sau để việc đối soát rõ ràng hơn:

```text
01-cover.jpg
02-living-room.jpg
03-kitchen.jpg
04-master-bedroom.jpg
05-bedroom.jpg
06-bathroom.jpg
07-view.jpg
```

- `01-cover` là ảnh muốn hiển thị trên card danh sách căn hộ.
- Có thể tải nhiều ảnh cho cùng một khu vực, ví dụ `02-living-room-01.jpg`, `02-living-room-02.jpg`.
- Giữ nguyên ảnh chất lượng cao; chưa cần resize hoặc nén trước khi tải lên.
- Không tải giấy tờ, thông tin khách thuê hoặc hình ảnh chứa dữ liệu cá nhân vào đây.

Sau khi ảnh được tải đủ, ảnh đã chọn và tối ưu sẽ được sao chép sang `frontend/public/assets/units/<mã-căn>/` để website sử dụng.
