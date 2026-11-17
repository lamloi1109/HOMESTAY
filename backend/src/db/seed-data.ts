// Frozen demonstration/reference data from the legacy seed; inserts never overwrite records.
export const ROLE_SEED = {
  "guest_member": {
    "name": "Guest/Member",
    "description": "Khách đặt phòng — quyền mặc định, không cần membership org",
    "permissions": []
  },
  "staff": {
    "name": "Staff",
    "description": "Lễ tân + buồng phòng: check-in/out, xem & thao tác booking",
    "permissions": [
      "property:read",
      "booking:read",
      "booking:write"
    ]
  },
  "owner": {
    "name": "Owner",
    "description": "Chủ nhà + kế toán: quản lý property, giá, doanh thu, đối soát",
    "permissions": [
      "property:read",
      "property:write",
      "booking:read",
      "booking:write",
      "revenue:read",
      "org:manage"
    ]
  },
  "admin": {
    "name": "Admin",
    "description": "Toàn quyền hệ thống",
    "permissions": [
      "property:read",
      "property:write",
      "booking:read",
      "booking:write",
      "revenue:read",
      "org:manage",
      "system:admin"
    ]
  }
};
export const AMENITY_SEED = [
  [
    "wifi",
    "Wi-Fi 200 Mbps riêng",
    "wifi",
    "Tiện nghi cơ bản"
  ],
  [
    "air_conditioner",
    "Điều hòa Multi âm trần",
    "air-vent",
    "Tiện nghi cơ bản"
  ],
  [
    "hot_water",
    "Nước nóng trung tâm",
    "shower-head",
    "Tiện nghi cơ bản"
  ],
  [
    "smart_tv",
    "Smart TV 4K 65 inch",
    "tv",
    "Tiện nghi cơ bản"
  ],
  [
    "linen",
    "Ga gối lụa Cotton 400TC",
    "bed",
    "Tiện nghi cơ bản"
  ],
  [
    "kitchen",
    "Bếp từ & Máy hút mùi",
    "cooking-pot",
    "Bếp"
  ],
  [
    "refrigerator",
    "Tủ lạnh Inverter 2 cánh",
    "refrigerator",
    "Bếp"
  ],
  [
    "microwave",
    "Lò vi sóng & Nướng",
    "microwave",
    "Bếp"
  ],
  [
    "kitchenware",
    "Đầy đủ dụng cụ nấu ăn",
    "utensils",
    "Bếp"
  ],
  [
    "washing_machine",
    "Máy giặt & sấy riêng",
    "washing-machine",
    "Giặt là"
  ],
  [
    "iron",
    "Bàn ủi & Cầu là hơi nước",
    "iron",
    "Giặt là"
  ],
  [
    "balcony",
    "Ban công ngắm sông/Landmark 81",
    "sun",
    "Không gian"
  ],
  [
    "low_e_glass",
    "Kính Low-E chống ồn 3 lớp",
    "shield",
    "Không gian"
  ],
  [
    "pool",
    "Hồ bơi vô cực cư dân",
    "waves",
    "Tiện ích tòa nhà"
  ],
  [
    "gym",
    "Phòng Gym Technogym",
    "dumbbell",
    "Tiện ích tòa nhà"
  ],
  [
    "park",
    "Công viên ven sông 14ha",
    "trees",
    "Tiện ích tòa nhà"
  ],
  [
    "security_24h",
    "An ninh thẻ từ 24/7",
    "shield-check",
    "Tiện ích tòa nhà"
  ],
  [
    "workspace",
    "Bàn làm việc thương gia",
    "laptop",
    "Làm việc"
  ],
  [
    "housekeeping",
    "Dọn phòng 2 lần / tuần",
    "sparkles",
    "Dịch vụ đi kèm"
  ],
  [
    "residence_support",
    "Hỗ trợ khai báo tạm trú",
    "file-check",
    "Dịch vụ đi kèm"
  ]
];
export const SERVICE_SEED = [
  {
    "name": "Đưa đón sân bay Tân Sơn Nhất (Mercedes / Sedona)",
    "category": "Di chuyển",
    "price": "800000",
    "price_unit": "chuyến",
    "description": "Xe cao cấp đón tận ga quốc tế/nội địa Tân Sơn Nhất về thẳng Vinhomes Central Park. Tài xế đón biển tên tại sảnh đến.",
    "icon": "car",
    "sort_order": 1
  },
  {
    "name": "Dọn phòng & Thay ga khăn theo yêu cầu",
    "category": "Dịch vụ phòng",
    "price": "350000",
    "price_unit": "lần",
    "description": "Vệ sinh toàn bộ căn hộ, thay mới bộ ga gối cotton 400TC, bổ sung set khăn tắm, đồ dùng tiêu hao và tinh dầu thơm phòng.",
    "icon": "sparkles",
    "sort_order": 2
  },
  {
    "name": "Giặt hấp cao cấp & Chăm sóc trang phục",
    "category": "Dịch vụ phòng",
    "price": "200000",
    "price_unit": "lần",
    "description": "Dịch vụ giặt hấp, là ủi trang phục cao cấp giao nhận tận cửa trong vòng 24 giờ.",
    "icon": "shirt",
    "sort_order": 3
  },
  {
    "name": "Tour du thuyền ngắm hoàng hôn sông Sài Gòn",
    "category": "Trải nghiệm",
    "price": "2500000",
    "price_unit": "chuyến",
    "description": "Khởi hành từ bến du thuyền Vinhomes Central Park, hành trình 2 giờ ngắm hoàng hôn và skyline thành phố kèm finger food và rượu vang.",
    "icon": "compass",
    "sort_order": 4
  },
  {
    "name": "Hỗ trợ đăng ký tạm trú cho khách quốc tế (24h)",
    "category": "Tiện ích cư trú",
    "price": "0",
    "price_unit": "lần",
    "description": "Gaoji House hỗ trợ đăng ký tạm trú hợp pháp cho chuyên gia và khách du lịch nước ngoài với cơ quan chức năng trong 24 giờ.",
    "icon": "shield-check",
    "sort_order": 5
  }
];
export const GAOJI_UNITS_SEED = [
  {
    "unit_code": "L1.29.08",
    "name": "Căn Hộ Landmark 1 · Tầng 29 · View Sông Sài Gòn",
    "slug": "l1-29-08-landmark-1-river-view",
    "tower": "Landmark 1",
    "floor": "Tầng 29",
    "view_type": "Sông Sài Gòn & Bến Du Thuyền",
    "price_monthly": "38000000",
    "price_nightly": "2200000",
    "sqm": 82,
    "bedrooms": 2,
    "bathrooms": 2,
    "max_guests": 4,
    "operational_status": "available",
    "description": "Căn hộ 2 phòng ngủ tại toà Landmark 1 với tầm nhìn thoáng đãng nhìn ra sông Sài Gòn và công viên 14ha. Thiết kế nội thất hiện đại với gỗ óc chó tự nhiên, ánh sáng tự nhiên ngập tràn và tiện nghi trọn gói chuẩn khách sạn cao cấp.",
    "address": "208 Nguyễn Hữu Cảnh, Phường 22, Bình Thạnh, TP. Hồ Chí Minh",
    "city": "TP. Hồ Chí Minh",
    "room_layout": [
      {
        "name": "Phòng Khách Liên Thông",
        "area": "28 m²",
        "note": "Sofa nỉ cao cấp, Smart TV 65 inch, cửa sổ kính tràn panorama"
      },
      {
        "name": "Phòng Ngủ Master",
        "area": "22 m²",
        "note": "Giường King 1m8, bàn trang điểm, phòng tắm ensuite khép kín"
      },
      {
        "name": "Phòng Ngủ Twin",
        "area": "16 m²",
        "note": "2 Giường đơn 1m2 nhìn ra sông, tủ âm tường"
      },
      {
        "name": "Bếp Đảo & Bàn Ăn",
        "area": "10 m²",
        "note": "Bếp từ âm, tủ lạnh side-by-side, máy hút mùi, bàn ăn 4 ghế"
      },
      {
        "name": "2 Phòng Tắm",
        "area": "6 m²",
        "note": "Vách kính cường lực, sen cây nóng lạnh, gương đèn LED cảm ứng"
      }
    ]
  },
  {
    "unit_code": "L3.44.09",
    "name": "Căn Hộ Landmark 3 · Tầng 44 · View Landmark 81",
    "slug": "l3-44-09-landmark-3-skyline-view",
    "tower": "Landmark 3",
    "floor": "Tầng 44",
    "view_type": "Landmark 81 & Skyline Quận 1",
    "price_monthly": "48000000",
    "price_nightly": "2800000",
    "sqm": 108,
    "bedrooms": 3,
    "bathrooms": 2,
    "max_guests": 6,
    "operational_status": "occupied",
    "description": "Căn hộ 3 phòng ngủ tầng cao với tầm nhìn ngoạn mục bao trọn tháp Landmark 81 và trung tâm thành phố. Không gian sống đẳng cấp dành cho gia đình hoặc chuyên gia công tác dài hạn.",
    "address": "208 Nguyễn Hữu Cảnh, Phường 22, Bình Thạnh, TP. Hồ Chí Minh",
    "city": "TP. Hồ Chí Minh",
    "room_layout": [
      {
        "name": "Phòng Khách Panorama",
        "area": "36 m²",
        "note": "Ban công góc rộng, ngắm pháo hoa và toàn cảnh Landmark 81"
      },
      {
        "name": "Phòng Ngủ Master",
        "area": "26 m²",
        "note": "Giường King 2m, bồn tắm nằm cao cấp, phòng thay đồ"
      },
      {
        "name": "Phòng Ngủ 2",
        "area": "18 m²",
        "note": "Giường Queen 1m6, bàn làm việc riêng"
      },
      {
        "name": "Phòng Ngủ 3",
        "area": "14 m²",
        "note": "Giường đơn 1m4, phù hợp trẻ nhỏ hoặc trợ lý"
      },
      {
        "name": "Bếp Mở Hiện Đại",
        "area": "14 m²",
        "note": "Bếp đảo đá marble, lò nướng âm, máy rửa bát Bosch"
      }
    ]
  },
  {
    "unit_code": "L81.07.12",
    "name": "Căn Hộ Landmark 81 · Tầng 7 · Trái Tim Vinhomes Central Park",
    "slug": "l81-07-12-landmark-81-luxury",
    "tower": "Landmark 81",
    "floor": "Tầng 7",
    "view_type": "Trực diện Tháp Landmark 81 & TTTM Vincom",
    "price_monthly": "28000000",
    "price_nightly": "1800000",
    "sqm": 54,
    "bedrooms": 1,
    "bathrooms": 1,
    "max_guests": 2,
    "operational_status": "available",
    "description": "Căn hộ 1 phòng ngủ cao cấp tọa lạc ngay khối đế toà tháp biểu tượng Landmark 81, kết nối trực tiếp trung tâm thương mại Vincom Center, rạp chiếu phim và chuỗi nhà hàng ẩm thực quốc tế.",
    "address": "208 Nguyễn Hữu Cảnh, Phường 22, Bình Thạnh, TP. Hồ Chí Minh",
    "city": "TP. Hồ Chí Minh",
    "room_layout": [
      {
        "name": "Phòng Khách & Bếp",
        "area": "26 m²",
        "note": "Smart TV, sofa bed, bếp từ đơn giản tiện lợi"
      },
      {
        "name": "Phòng Ngủ Ấm Cúng",
        "area": "20 m²",
        "note": "Giường King 1m8, rèm 2 lớp cản sáng tuyệt đối"
      },
      {
        "name": "Phòng Tắm Cao Cấp",
        "area": "8 m²",
        "note": "Thiết bị vệ sinh Kohler, sen tắm massage"
      }
    ]
  },
  {
    "unit_code": "P1.27.10",
    "name": "Căn Hộ Park 1 · Tầng 27 · View Công Viên 14ha & Hồ Bơi",
    "slug": "p1-27-10-park-1-park-view",
    "tower": "Park 1",
    "floor": "Tầng 27",
    "view_type": "Công viên ven sông 14ha & Hồ bơi",
    "price_monthly": "36000000",
    "price_nightly": "2100000",
    "sqm": 85,
    "bedrooms": 2,
    "bathrooms": 2,
    "max_guests": 4,
    "operational_status": "held",
    "description": "Không gian sống xanh mát nhìn trọn mảng xanh công viên ven sông lớn nhất TP.HCM. Căn hộ 2 phòng ngủ thoáng đãng, đón gió sông trong lành và ban công rộng rãi.",
    "address": "208 Nguyễn Hữu Cảnh, Phường 22, Bình Thạnh, TP. Hồ Chí Minh",
    "city": "TP. Hồ Chí Minh",
    "room_layout": [
      {
        "name": "Phòng Khách Ban Công",
        "area": "30 m²",
        "note": "Ban công view công viên, bàn trà thư giãn"
      },
      {
        "name": "Phòng Ngủ Master",
        "area": "24 m²",
        "note": "Giường King 1m8, tủ quần áo âm tường"
      },
      {
        "name": "Phòng Ngủ Thứ Hai",
        "area": "17 m²",
        "note": "Giường Queen 1m6, view hồ bơi nội khu"
      },
      {
        "name": "Khu Bếp Kín",
        "area": "14 m²",
        "note": "Bếp tách biệt phòng khách, không ám mùi"
      }
    ]
  },
  {
    "unit_code": "P3.42.12",
    "name": "Căn Hộ Park 3 · Tầng 42 · Penthouse Duplex Toàn Cảnh Sông",
    "slug": "p3-42-12-park-3-duplex-penthouse",
    "tower": "Park 3",
    "floor": "Tầng 42",
    "view_type": "Toàn cảnh 360 độ Sông Sài Gòn & Bán đảo Thủ Thiêm",
    "price_monthly": "65000000",
    "price_nightly": "3500000",
    "sqm": 140,
    "bedrooms": 3,
    "bathrooms": 3,
    "max_guests": 6,
    "operational_status": "available",
    "description": "Căn hộ cao cấp 3 phòng ngủ với diện tích 140m² trên tầng 42 tòa Park 3. Thiết kế mở sang trọng, phòng tắm kính view sông, phục vụ các chuyên gia cấp cao và gia đình tìm kiếm chuẩn mực sống thượng lưu.",
    "address": "208 Nguyễn Hữu Cảnh, Phường 22, Bình Thạnh, TP. Hồ Chí Minh",
    "city": "TP. Hồ Chí Minh",
    "room_layout": [
      {
        "name": "Phòng Khách Duplex Trần Cao",
        "area": "50 m²",
        "note": "Thông tầng 6m, sofa nhập khẩu Ý, hệ thống âm thanh vòm"
      },
      {
        "name": "Phòng Ngủ Master Suite",
        "area": "35 m²",
        "note": "Phòng ngủ lớn, bồn tắm kính hướng sông Sài Gòn"
      },
      {
        "name": "Phòng Ngủ 2 VIP",
        "area": "25 m²",
        "note": "Giường King 1m8, phòng tắm riêng"
      },
      {
        "name": "Phòng Ngủ 3",
        "area": "18 m²",
        "note": "Giường Queen 1m6, bàn làm việc"
      },
      {
        "name": "Bếp Đảo & Quầy Bar",
        "area": "12 m²",
        "note": "Quầy bar mini, tủ rượu vang chuyên dụng"
      }
    ]
  }
];
