"""Permission codes — RBAC permission-based (KE_HOACH Phase 1: không hardcode
if-else theo role name; check theo permission để Phase 7+ thêm role mới không
sửa code).
"""


class Perm:
    PROPERTY_READ = "property:read"
    PROPERTY_WRITE = "property:write"
    BOOKING_READ = "booking:read"
    BOOKING_WRITE = "booking:write"
    REVENUE_READ = "revenue:read"
    ORG_MANAGE = "org:manage"
    SYSTEM_ADMIN = "system:admin"


# Seed 4 role MVP (bảng roles hỗ trợ mở rộng 8 role Phase 7+ chỉ bằng data).
ROLE_SEED: dict[str, dict] = {
    "guest_member": {
        "name": "Guest/Member",
        "description": "Khách đặt phòng — quyền mặc định, không cần membership org",
        "permissions": [],
    },
    "staff": {
        "name": "Staff",
        "description": "Lễ tân + buồng phòng: check-in/out, xem & thao tác booking",
        "permissions": [Perm.PROPERTY_READ, Perm.BOOKING_READ, Perm.BOOKING_WRITE],
    },
    "owner": {
        "name": "Owner",
        "description": "Chủ nhà + kế toán: quản lý property, giá, doanh thu, đối soát",
        "permissions": [
            Perm.PROPERTY_READ,
            Perm.PROPERTY_WRITE,
            Perm.BOOKING_READ,
            Perm.BOOKING_WRITE,
            Perm.REVENUE_READ,
            Perm.ORG_MANAGE,
        ],
    },
    "admin": {
        "name": "Admin",
        "description": "Toàn quyền hệ thống",
        "permissions": [
            Perm.PROPERTY_READ,
            Perm.PROPERTY_WRITE,
            Perm.BOOKING_READ,
            Perm.BOOKING_WRITE,
            Perm.REVENUE_READ,
            Perm.ORG_MANAGE,
            Perm.SYSTEM_ADMIN,
        ],
    },
}
