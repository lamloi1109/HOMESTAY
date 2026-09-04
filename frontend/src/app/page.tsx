"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  Accordion,
  AccordionItem,
  Button,
  ContactRail,
  FeatureCard,
  FilterTabs,
  Icon,
  InquiryModal,
  PhotoPlate,
  SectionHeader,
  UnitCard,
} from "@/components/gaoji";
import { Quote } from "lucide-react";

// Complete 4-Language Dictionary for Gao Ji House Landing Page
const DICT = {
  vi: {
    // 1. Header & Hero
    heroEye: "Gao Ji House · Căn Hộ Dịch Vụ Cao Cấp · Vinhomes Central Park",
    heroTitle: "Về Nhà · Tận Hưởng Không Gian Sống",
    heroBody: "Năm căn hộ dịch vụ cao cấp đầy đủ nội thất bên bờ sông Sài Gòn và Landmark 81. Dọn phòng định kỳ, lễ tân 24/7, hỗ trợ đăng ký tạm trú — trọn gói trong một mức giá minh bạch.",
    heroCta1: "Xem Danh Sách Căn Hộ",
    heroCta2: "Đặt Phòng Ngay",
    statRate: "Giá Thuê Trọn Gói",
    statRateVal: "Từ 24 Triệu VNĐ",
    statRatePer: " / tháng",
    statUnits: "Danh Mục Căn Hộ",
    statUnitsVal: "5 Căn · 1–3 PN",
    statDist: "Landmark 81",
    statDistVal: "0.2 KM · 3 Phút",
    statReply: "Phản Hồi Zalo",
    statReplyVal: "Trong 2 Giờ",

    // 2. Floating Booking Bar
    queryBarSub: "Guest Relations phản hồi trong 2 giờ làm việc · Hỗ trợ Tiếng Việt · English · 中文",

    // 3. Editorial Showcase
    introEye: "Cho Thuê Căn Hộ · Landmark & Vinhomes Central Park",
    introTitle: "Căn Hộ Cho Thuê Trong Landmark Và Vinhomes Central Park",
    introBody: "Gao Ji House cho thuê năm căn hộ tại các toà Landmark 1, Landmark 3, Landmark 81 và Park 1, Park 3 trong Vinhomes Central Park. Thuê theo tháng hoặc theo đêm, nội thất hoàn thiện sẵn, giá đã gồm phí quản lý, internet và dọn phòng định kỳ.",
    s1v: "10 Phút",
    s1l: "Tới Quận 1 CBD",
    s2v: "2 Lần / Tuần",
    s2l: "Dọn Phòng & Thay Ga",
    s3v: "24/7",
    s3l: "Lễ Tân Đa Ngữ",
    introCta: "Xem Danh Sách Căn Hộ",
    plate1: "Hình 01 — Không Gian Khách & Bàn Ăn Liên Thông",

    // 4. Units List
    unitsEye: "Danh Sách Căn Hộ",
    unitsTitle: "",
    unitsAside: "",
    lblType: "Loại Căn Hộ",
    lblFloor: "Tầng",
    lblPrice: "Khoảng Giá Thuê (VNĐ / Tháng)",
    lblBeds: "Số Phòng Ngủ",
    tabAll: "Tất Cả",
    tab1PN: "1 Phòng Ngủ",
    tab2PN: "2 Phòng Ngủ",
    tab3PN: "Penthouse Dinh Thự",
    fAll: "Mọi Tầng",
    fLow: "Tầng Thấp (01–12)",
    fMid: "Tầng Trung (13–28)",
    fHigh: "Tầng Cao (29–48)",
    btnClear: "Bỏ Bộ Lọc",
    emptyEye: "Chưa Có Căn Trống Đúng Tiêu Chí",
    emptyBody: "Gao Ji House còn căn tương tự ở tầng khác — nhắn Zalo để nhận danh sách chờ trong ngày.",
    emptyCta1: "Nhận Danh Sách Chờ",
    emptyCta2: "Xem Tất Cả 5 Căn",
    unitsNote: "Giá thuê đã gồm phí quản lý · Internet · Dọn phòng định kỳ · Không phí dịch vụ đặt phòng",
    unitWord: "CĂN HỘ",
    statusAvail: "Còn Phòng",
    statusHeld: "Đã Giữ Chỗ · Nhận Chờ",
    cardView: "Xem Chi Tiết Căn Hộ",
    cardInquire: "Đặt Phòng / Hỏi Giá",
    u: {
      "L1.29.08": { title: "Căn 2PN View Sông & Landmark 81", type: "2 Phòng Ngủ · Tầng Cao" },
      "P1.27.10": { title: "Căn 1PN Nắng Chiều Hướng Sông Sài Gòn", type: "1 Phòng Ngủ · Park 1" },
      "L81.07.12": { title: "Căn 1PN Sky Suite Spa Chuẩn Khách Sạn", type: "1 Phòng Ngủ · Landmark 81" },
      "P3.42.12": { title: "Căn 2PN Nội Thất Gỗ Walnut Mộc", type: "2 Phòng Ngủ · Tân Trang 2026" },
      "L3.44.09": { title: "Penthouse Duplex Thông Tầng Nhìn Landmark", type: "3 Phòng Ngủ · Duplex" },
    },

    // 5. Location Radar & Maps
    locEye: "Vinhomes Central Park · Bình Thạnh",
    locTitle: "Vị Trí & Bán Kính Kết Nối Sài Gòn",
    locBody: "Thời gian di chuyển thực tế bằng ô tô từ sảnh toà nhà, đo trong hai khung giờ của Sài Gòn.",
    tOff: "Giờ Thấp Điểm",
    tPeak: "Giờ Cao Điểm",
    noteOff: "Đo 10:00–15:00 các ngày trong tuần · Google Maps",
    notePeak: "Đo 17:30–19:00 các ngày trong tuần · Google Maps",
    mins: (n: number) => n + " phút",
    spotEye: "Địa Điểm Lân Cận",
    spotHead: "Danh Sách 12 Điểm Đến Nổi Tiếng",
    spotBadge: "12 Điểm Đến",
    mapTitle: "Gao Ji House · Bản Đồ Vị Trí Ven Sông",
    legend1: "Gao Ji Residence",
    legend2: "Sông Sài Gòn",
    infoWord: "Điểm Đến",
    infoTail: "Chi Tiết",
    distLbl: "Khoảng Cách",
    walk: "Đi Bộ",
    drive: "Ô Tô",
    btnDir: "Chỉ Đường",
    btnMaps: "Mở Google Maps",
    plate2: "Hình 02 — Vinhomes Central Park · Sông Sài Gòn",
    mapFoot: "Bán kính kết nối từ sảnh toà nhà",
    addrEye: "Địa Chỉ Nhận Phòng",
    spots: [
      { name: "Landmark 81 & TTTM Vincom", blurb: "Trung tâm thương mại, đài quan sát cao nhất Việt Nam, ẩm thực Á-Âu và siêu thị WinMart." },
      { name: "Công Viên Vinhomes Central Park 14ha", blurb: "Công viên ven sông lớn nhất trung tâm Sài Gòn với vườn Nhật, hồ cá Koi và đường dạo bộ 1.2km." },
      { name: "Chợ Bến Thành & Quận 1 CBD", blurb: "Biểu tượng văn hoá trung tâm Sài Gòn, phố thương mại, ẩm thực và mua sắm sầm uất." },
      { name: "Nhà Hát Thành Phố & Phố Đi Bộ", blurb: "Trục đi bộ Nguyễn Huệ, công trình kiến trúc cổ điển Pháp và các khách sạn 5 sao." },
      { name: "Nhà Thờ Đức Bà & Bưu Điện TP", blurb: "Khu vực lõi di sản trung tâm Quận 1, quảng trường đi bộ và cà phê sách." },
      { name: "Phố Nhật Bản Lê Thánh Tôn", blurb: "Khu ẩm thực Nhật Bản tinh hoa, quán rượu Izakaya và spa thư giãn cao cấp." },
      { name: "Thảo Cầm Viên Sài Gòn", blurb: "Công viên bách thảo lâu đời, không gian cây xanh cổ thụ thanh bình giữa lòng thành phố." },
      { name: "Khu Đô Thị Mới Thủ Thiêm", blurb: "Trung tâm tài chính mới, cầu Ba Son, công viên bờ sông Thủ Thiêm ngắm hoàng hôn." },
      { name: "Bảo Tàng Mỹ Thuật TP.HCM", blurb: "Toà nhà kiến trúc Art Deco cổ kính trưng bày các tác phẩm hội hoạ và điêu khắc quý giá." },
      { name: "Khu Phố Tây Thảo Điền (Quận 2)", blurb: "Cộng đồng expat quốc tế, nhà hàng fine dining, quán cafe specialty và nghệ thuật." },
      { name: "Sân Bay Quốc Tế Tân Sơn Nhất", blurb: "Cửa ngõ hàng không quốc tế, kết nối thẳng qua tuyến Phạm Văn Đồng và Nguyễn Hữu Cảnh." },
      { name: "Bến Bạch Đằng & Waterbus", blurb: "Ga tàu buýt đường thuỷ sông Sài Gòn ngắm cảnh hoàng hôn và du thuyền đêm." },
    ],

    // 6. Amenities
    amEye: "Tiện Ích Nội Khu Dành Cho Cư Dân",
    amTitle: "Tiện Ích & Dịch Vụ Cư Dân",
    amAside: "Khách lưu trú Gao Ji House dùng tiện ích nội khu như cư dân — thẻ ra vào được cấp trong ngày nhận phòng.",
    a1e: "Sanctuary · Thư Giãn Bờ Sông",
    a1t: "Hồ Bơi Ngoài Trời & 14 Ha Công Viên",
    a1b: "Hồ bơi tràn bờ mở 6:00–21:00, kèm 14 ha công viên ven sông Sài Gòn ngay dưới chân toà nhà.",
    a1l: ["Mở 6:00 – 21:00 hằng ngày", "Khăn hồ bơi cấp tại lễ tân", "Đường chạy ven sông 1.2 km"],
    a2e: "Wellness · Thể Chất & Tái Tạo",
    a2t: "Phòng Gym Technogym Nội Khu",
    a2b: "Phòng gym thiết bị Technogym mở 5:00–23:00, đã bao gồm trong giá thuê cho toàn bộ khách lưu trú.",
    a2l: ["Mở 5:00 – 23:00 hằng ngày", "Thiết bị Technogym", "Phòng yoga & sauna tuyết tùng"],
    a3e: "Exclusivity · Riêng Tư & Đẳng Cấp",
    a3t: "Hầm Rượu Vang Sommelier & Sky Terrace",
    a3b: "Sân thượng ngắm Landmark 81 và hầm rượu do sommelier tuyển chọn, đặt chỗ qua lễ tân trước 18:00.",
    a3l: ["Đặt chỗ qua lễ tân trước 18:00", "Sommelier tuyển chọn theo mùa", "Tầm nhìn Landmark 81 & sông"],

    // 7. About Us & Operating Team
    abEye: "Về Chúng Tôi · Vận Hành Từ 2019",
    abTitle: "Gao Ji House · Chủ Căn Hộ Cũng Là Người Vận Hành",
    abP1: "Gao Ji House bắt đầu năm 2019 với một căn hộ cho thuê trong Park 1. Đến nay đội ngũ tự vận hành năm căn hộ trong Vinhomes Central Park — không qua đơn vị trung gian, không nhận uỷ thác từ chủ nhà khác. Mỗi căn đều do Gao Ji House sở hữu, tự thiết kế nội thất và tự chịu trách nhiệm bảo trì.",
    abP2: "Khách thuê chủ yếu là chuyên gia nước ngoài công tác dài hạn, gia đình chờ nhận nhà và khách doanh nghiệp lưu trú theo tháng. Quy trình buồng phòng, đổi ga khăn và bảo trì thiết bị dựng theo chuẩn khách sạn, do chính người trong đội kiểm tra định kỳ.",
    ab1l: "Năm Bắt Đầu",
    ab2l: "Căn Hộ Tự Vận Hành",
    ab3l: "Người Trong Đội",
    ab4v: "3 Ngữ",
    teamHead: "Đội Ngũ Vận Hành",
    teamSub: "Liên Hệ Trực Tiếp",
    r1l: "Chủ Đầu Tư & Quản Lý Căn Hộ",
    r1b: "Chốt hợp đồng thuê, giá dài hạn và mọi yêu cầu đặc biệt của khách doanh nghiệp.",
    r2b: "Trả lời tin nhắn trong 2 giờ, gửi video thực tế, xếp lịch xem căn và đưa đón sân bay.",
    r3l: "Buồng Phòng & Bảo Trì",
    r3n: "Tổ 3 Người · Nội Bộ",
    r3b: "Dọn phòng 2 lần / tuần, đổi ga khăn, kiểm tra thiết bị bếp và điều hoà mỗi 6 tháng.",
    r4l: "Thủ Tục & Pháp Lý",
    r4b: "Hợp đồng công chứng, hoá đơn VAT và đăng ký tạm trú cho khách nước ngoài.",
    socEye: "Mạng Xã Hội & Kênh Liên Hệ",
    socBody: "Ảnh căn hộ mới, tình trạng phòng trống và video quay dọc từng căn được đăng trước tại các kênh dưới đây.",
    ytSub: "Gao Ji House · Video Căn Hộ",

    // 8. Contact & Zalo First SOP
    ctEye: "Guest Relations · Phản Hồi Trong 2 Giờ",
    ctTitle: "Giữ Chỗ Căn Hộ Qua Zalo",
    ctBody: "Nhắn Zalo để nhận bảng giá đầy đủ, video thực tế của từng căn và tình trạng phòng trống theo ngày. Quản lý căn hộ trả lời trực tiếp, không qua tổng đài.",
    chZalo: "Nhắn Zalo Nhận Bảng Giá",
    ctCta2: "Gửi Yêu Cầu Đặt Phòng",
    qrEye: "Mã QR Quét Nhanh Zalo & WeChat",
    rowHours: "Giờ Làm Việc",
    hoursVal: "08:00 – 21:00 · T2–CN",
    rowLang: "Ngôn Ngữ Hỗ Trợ",

    // 9. Trust & Legal
    trustEye: "Đơn Vị Đồng Hành & Bảo Chứng Pháp Lý",
    t1Label: "Kiến Trúc & Không Gian",
    t1Title: "Architectural Design & Fit-out",
    t1Body: "Nội thất thiết kế theo phong cách Indochine kết hợp Modern Japandi tối giản, tinh tế.",
    t2Label: "Tiêu Chuẩn 5 Sao",
    t2Title: "5-Star Hospitality Standard",
    t2Body: "Quy trình buồng phòng, vệ sinh và khử khuẩn đạt tiêu chuẩn khách sạn cao cấp.",
    t3Label: "Thiết Bị Bàn Giao",
    t3Title: "Handover Standards & Equipment",
    t3Body: "Trang bị đầy đủ thiết bị âm tủ cao cấp Bosch, Gaggenau, Duravit và máy giặt sấy.",
    t4Label: "Pháp Lý Rõ Ràng",
    t4Title: "Pháp Lý & Hợp Đồng Công Chứng",
    t4Body: "Căn hộ chính chủ, hỗ trợ xuất hoá đơn VAT đầy đủ và đăng ký tạm trú dài hạn.",

    // 10. Trust Badges
    tbOta: "Đánh giá xuất sắc trên các nền tảng OTA",
    tbCorp: "Lựa chọn lưu trú của chuyên gia đa quốc gia",
    tbPay: "Chấp nhận thanh toán qua VNPay, MoMo, Visa",

    // 11. Social Proof
    spEye: "Khách hàng nói gì về Gao Ji House",
    spTitle: "Trải nghiệm lưu trú thực tế",
    sp1: "Không gian yên tĩnh, an ninh tốt, nội thất chuẩn khách sạn 5 sao. Rất phù hợp cho chuyến công tác dài ngày tại TP.HCM.",
    sp1a: "Khách doanh nghiệp, 3 tháng lưu trú",
    sp2: "Căn hộ rất sạch sẽ, bếp đầy đủ dụng cụ để nấu ăn. Hồ bơi và công viên ngay dưới nhà rất tiện cho trẻ nhỏ.",
    sp2a: "Gia đình, kỳ nghỉ cuối tuần",
    sp3: "Dịch vụ tuyệt vời và phản hồi nhanh chóng qua Zalo. Chắc chắn sẽ quay lại trong tương lai.",
    sp3a: "Khách Expats, 1 năm lưu trú",

    // 12. FAQ
    faqEye: "Câu hỏi thường gặp",
    faqTitle: "Thông tin cần biết trước khi đặt phòng",
    faq1q: "Giờ nhận và trả phòng là mấy giờ?",
    faq1a: "Giờ nhận phòng tiêu chuẩn là từ 14:00, và trả phòng trước 12:00 trưa. Chúng tôi hỗ trợ nhận phòng sớm hoặc trả trễ tuỳ thuộc vào tình trạng phòng trống.",
    faq2q: "Giá thuê đã bao gồm những chi phí gì?",
    faq2a: "Giá đã bao gồm phí quản lý toà nhà, internet tốc độ cao, và dịch vụ dọn dẹp buồng phòng 2 lần/tuần. Chưa bao gồm điện nước sinh hoạt (đối với khách thuê tháng).",
    faq3q: "Có chỗ đậu xe ô tô không?",
    faq3a: "Có, Vinhomes Central Park có hệ thống hầm đậu xe rộng rãi. Phí giữ xe theo quy định của ban quản lý toà nhà.",
    faq4q: "Có được mang theo thú cưng không?",
    faq4a: "Rất tiếc, để đảm bảo vệ sinh và tránh dị ứng cho các khách lưu trú sau, chúng tôi không hỗ trợ mang theo thú cưng.",
    faq5q: "Chính sách hoàn huỷ như thế nào?",
    faq5a: "Miễn phí huỷ trước 7 ngày đối với khách thuê ngắn hạn. Tiền cọc sẽ được hoàn trả đầy đủ vào tài khoản của bạn.",

    // 13. Final CTA
    ctaTitle: "Sẵn sàng trải nghiệm không gian sống đẳng cấp tại Vinhomes Central Park?",
    ctaBody: "Giữ căn hộ của bạn ngay hôm nay.",
    ctaBtn: "Xem phòng trống & Hỏi giá",
  },
  en: {
    heroEye: "Gao Ji House · Luxury Serviced Apartments · Vinhomes Central Park",
    heroTitle: "Welcome Home · Elevated Living In Saigon",
    heroBody: "Five fully furnished luxury serviced apartments adjacent to Landmark 81 and Saigon River. Regular housekeeping, 24/7 concierge, registration support — all-inclusive in one transparent rate.",
    heroCta1: "View Apartment Collection",
    heroCta2: "Book Now",
    statRate: "All-Inclusive Rent",
    statRateVal: "From 24M VNĐ",
    statRatePer: " / month",
    statUnits: "Portfolio",
    statUnitsVal: "5 Units · 1–3 Beds",
    statDist: "Landmark 81",
    statDistVal: "0.2 KM · 3 Mins",
    statReply: "Zalo Response",
    statReplyVal: "Within 2 Hours",

    queryBarSub: "Guest Relations replies within 2 working hours · English · Vietnamese · Chinese",

    // 3. Editorial Showcase
    introEye: "Apartments For Rent · Landmark & Vinhomes Central Park",
    introTitle: "Apartments For Rent In Landmark And Vinhomes Central Park",
    introBody: "Gao Ji House offers five serviced apartments across Landmark 1, Landmark 3, Landmark 81, Park 1, and Park 3 in Vinhomes Central Park. Available for monthly or nightly lease, fully furnished, with management fees, high-speed internet, and regular housekeeping included.",
    s1v: "10 Mins",
    s1l: "To District 1 CBD",
    s2v: "2x / Week",
    s2l: "Housekeeping & Linen",
    s3v: "24/7",
    s3l: "Multilingual Team",
    introCta: "View Apartment Collection",
    plate1: "Plate 01 — Open Plan Living & Dining Area",

    unitsEye: "Rates & Floor Plans",
    unitsTitle: "Serviced Apartment Collection",
    unitsAside: "",
    lblType: "Apartment Type",
    lblFloor: "Floor Level",
    lblPrice: "Monthly Rent Range (VNĐ)",
    lblBeds: "Bedrooms",
    tabAll: "All",
    tab1PN: "1 Bedroom",
    tab2PN: "2 Bedrooms",
    tab3PN: "Penthouse Duplex",
    fAll: "All Floors",
    fLow: "Low Floors (01–12)",
    fMid: "Mid Floors (13–28)",
    fHigh: "High Floors (29–48)",
    btnClear: "Clear Filter",
    emptyEye: "No Units Matching Your Criteria",
    emptyBody: "We have similar units on other floors — message on Zalo to receive same-day waitlist updates.",
    emptyCta1: "Join Waitlist",
    emptyCta2: "View All 5 Units",
    unitsNote: "Rent includes management fees · High-speed Wi-Fi · Bi-weekly housekeeping · No booking fee",
    unitWord: "UNIT",
    statusAvail: "Available",
    statusHeld: "Reserved · Waitlist",
    cardView: "View Unit Details",
    cardInquire: "Book / Inquire Rate",
    u: {
      "L1.29.08": { title: "2BR River & Landmark 81 View", type: "2 Bedrooms · High Floor" },
      "P1.27.10": { title: "1BR Sunlit River-Facing Suite", type: "1 Bedroom · Park 1" },
      "L81.07.12": { title: "1BR Hotel-Grade Sky Suite", type: "1 Bedroom · Landmark 81" },
      "P3.42.12": { title: "2BR Natural Walnut Wood Residence", type: "2 Bedrooms · Renovated 2026" },
      "L3.44.09": { title: "Duplex Penthouse Overlooking Landmark", type: "3 Bedrooms · Duplex" },
    },

    locEye: "Vinhomes Central Park · Binh Thanh",
    locTitle: "Prime Location & Saigon Travel Radius",
    locBody: "Actual driving time from the building lobby, measured during off-peak and peak Saigon traffic.",
    tOff: "Off-Peak Hours",
    tPeak: "Peak Hours",
    noteOff: "Measured 10:00–15:00 weekdays · Google Maps",
    notePeak: "Measured 17:30–19:00 weekdays · Google Maps",
    mins: (n: number) => n + " mins",
    spotEye: "Nearby Destinations",
    spotHead: "12 Iconic Saigon Destinations",
    spotBadge: "12 Destinations",
    mapTitle: "Gao Ji House · Riverside Location & Travel Radius",
    legend1: "Gao Ji Residence",
    legend2: "Saigon River",
    infoWord: "Destination",
    infoTail: "Details",
    distLbl: "Distance",
    walk: "Walk",
    drive: "Drive",
    btnDir: "Get Directions",
    btnMaps: "Open Google Maps",
    plate2: "Plate 02 — Vinhomes Central Park · Saigon River",
    mapFoot: "Travel radius measured from building lobby",
    addrEye: "Check-in Address",
    spots: [
      { name: "Landmark 81 & Vincom Center", blurb: "Shopping mall, highest observatory in Vietnam, international dining, and WinMart supermarket." },
      { name: "14ha Central Park Riverfront", blurb: "Largest riverfront park in central Saigon with Japanese garden, Koi pond, and 1.2km jogging trail." },
      { name: "Ben Thanh Market & District 1 CBD", blurb: "Saigon cultural icon, bustling commercial streets, dining, and vibrant boutique shops." },
      { name: "Saigon Opera House & Walking Street", blurb: "Nguyen Hue pedestrian promenade, French colonial landmarks, and 5-star heritage hotels." },
      { name: "Notre Dame Cathedral & Post Office", blurb: "District 1 historic core, book street cafes, and lush park grounds." },
      { name: "Le Thanh Ton Little Japan", blurb: "Authentic Japanese dining hub, hidden izakayas, and premium wellness spas." },
      { name: "Saigon Zoo & Botanical Gardens", blurb: "Century-old botanical oasis offering serene greenery right next to District 1." },
      { name: "Thu Thiem New Urban Area", blurb: "New financial district across Ba Son Bridge with scenic sunset riverfront promenades." },
      { name: "Fine Arts Museum of Ho Chi Minh City", blurb: "Historic Art Deco colonial mansion showcasing classic Vietnamese art and sculptures." },
      { name: "Thao Dien Expat Village (District 2)", blurb: "Cosmopolitan international community, riverside fine dining, and boutique bakeries." },
      { name: "Tan Son Nhat International Airport", blurb: "International gateway accessible via direct arterial routes." },
      { name: "Bach Dang Pier & Saigon Waterbus", blurb: "Scenic waterbus terminal offering sunset river tours and evening dinner cruises." },
    ],

    amEye: "Resident In-Building Amenities",
    amTitle: "Resident Amenities & Services",
    amAside: "Gao Ji House guests enjoy full resident amenities — access cards provided upon check-in.",
    a1e: "Sanctuary · Riverside Wellness",
    a1t: "Outdoor Swimming Pools & 14ha Park",
    a1b: "Infinity pool open 6:00–21:00, with 14ha riverfront parkland directly at the foot of your tower.",
    a1l: ["Open 6:00 – 21:00 daily", "Pool towels provided", "1.2 km riverfront jogging path"],
    a2e: "Wellness · Fitness Without Fee",
    a2t: "Technogym Fitness Center",
    a2b: "Technogym gym open 5:00–23:00, included in the monthly rent for all staying residents.",
    a2l: ["Open 5:00 – 23:00 daily", "Technogym equipment", "Yoga studio & cedar sauna"],
    a3e: "Exclusivity · Private Lifestyle",
    a3t: "Sommelier Wine Vault & Sky Terrace",
    a3b: "Sky terrace overlooking Landmark 81 with curated wine cellar, reserve via reception before 18:00.",
    a3l: ["Reserve via front desk by 18:00", "Seasonal sommelier curation", "Landmark 81 & river panorama"],

    abEye: "About Us · Operating Since 2019",
    abTitle: "Gao Ji House · Owners & Direct Operators",
    abP1: "Gao Ji House began in 2019 with a single residence in Park 1. Today our team directly manages five apartments in Vinhomes Central Park without intermediaries or third-party consignments.",
    abP2: "Our tenants are primarily multinational corporate executives, families in transition, and monthly corporate clients.",
    ab1l: "Founded Year",
    ab2l: "Direct Managed Units",
    ab3l: "Core Team",
    ab4v: "3 Languages",
    teamHead: "Operations Team",
    teamSub: "Direct Contact",
    r1l: "Owner & General Manager",
    r1b: "Handles lease agreements, corporate terms, and bespoke executive requirements.",
    r2b: "Replies within 2 hours, provides video walkthroughs, viewing schedules, and airport transfers.",
    r3l: "Housekeeping & Maintenance",
    r3n: "In-House 3-Person Team",
    r3b: "Bi-weekly cleaning, linen replacement, and bi-annual appliance & AC servicing.",
    r4l: "Legal & Corporate Compliance",
    r4b: "Notarized contracts, VAT invoicing, and foreign temporary residence registration.",
    socEye: "Social & Communication Channels",
    socBody: "Fresh unit updates, availability status, and vertical video walkthroughs are shared across our channels.",
    ytSub: "Gao Ji House · Apartment Videos",

    ctEye: "Guest Relations · 2-Hour Response",
    ctTitle: "Reserve Your Residence Via Zalo",
    ctBody: "Message on Zalo for full rate sheets, genuine video walkthroughs, and real-time calendar availability. Direct owner response.",
    chZalo: "Message Zalo For Rates",
    ctCta2: "Send Booking Inquiry",
    qrEye: "Quick Scan QR For WeChat & Telegram",
    rowHours: "Working Hours",
    hoursVal: "08:00 – 21:00 · Mon–Sun",
    rowLang: "Supported Languages",

    trustEye: "Partners & Legal Assurance",
    t1Label: "Interior & Architecture",
    t1Title: "Architectural Design & Fit-out",
    t1Body: "Indochine elegance meets Modern Japandi minimalism for serene acoustic comfort.",
    t2Label: "5-Star Standard",
    t2Title: "5-Star Hospitality Standard",
    t2Body: "Hotel-grade housekeeping and sanitized linen replacement protocols.",
    t3Label: "Turnkey Equipment",
    t3Title: "Handover Standards & Equipment",
    t3Body: "Fully equipped with Bosch, Gaggenau, Duravit sanitary ware, and washer-dryers.",
    t4Label: "Compliance",
    t4Title: "Legal Registration & VAT Invoicing",
    t4Body: "Direct ownership, notarized leasing, monthly VAT invoices, and full residency support.",

    tbOta: "Exceptional ratings on OTA platforms",
    tbCorp: "The preferred choice for multinational executives",
    tbPay: "Accepting VNPay, MoMo, Visa",

    spEye: "What Our Guests Say",
    spTitle: "Real Stay Experiences",
    sp1: "Quiet environment, excellent security, and 5-star hotel standard interiors. Perfect for long business trips in HCMC.",
    sp1a: "Corporate Guest, 3-month stay",
    sp2: "Very clean apartment with a fully equipped kitchen. The pool and park downstairs are great for kids.",
    sp2a: "Family, Weekend getaway",
    sp3: "Excellent service and prompt support via Zalo. Will definitely return in the future.",
    sp3a: "Expat, 1-year stay",

    faqEye: "Frequently Asked Questions",
    faqTitle: "Good to Know Before You Book",
    faq1q: "What are the check-in and check-out times?",
    faq1a: "Standard check-in is from 14:00, and check-out is before 12:00. We support early check-in or late check-out subject to availability.",
    faq2q: "What is included in the rent?",
    faq2a: "Rent includes building management fees, high-speed internet, and bi-weekly housekeeping. Utility bills (electricity/water) are excluded for monthly stays.",
    faq3q: "Is there parking available?",
    faq3a: "Yes, Vinhomes Central Park has spacious underground parking. Fees apply according to building management regulations.",
    faq4q: "Are pets allowed?",
    faq4a: "Unfortunately, to maintain hygiene and prevent allergies for future guests, we do not accommodate pets.",
    faq5q: "What is the cancellation policy?",
    faq5a: "Free cancellation up to 7 days before arrival for short-term stays. Your deposit will be fully refunded.",

    ctaTitle: "Ready to experience premium living at Vinhomes Central Park?",
    ctaBody: "Reserve your apartment today.",
    ctaBtn: "Check Availability & Inquire",
  },
  cn: {
    heroEye: "Gao Ji House · 高端服务式公寓 · 万豪金冠 Vinhomes Central Park",
    heroTitle: "归家 · 享受静谧雅致的私享居所",
    heroBody: "地处 Landmark 81 与西贡河畔，五套高规格精装服务式公寓。定期保洁、24/7 前台、外籍暂住申报——一站式全包透明月租。",
    heroCta1: "查看所有房源",
    heroCta2: "立即预订",
    statRate: "全包月租",
    statRateVal: "2400 万越南盾起",
    statRatePer: " / 月",
    statUnits: "公寓房型",
    statUnitsVal: "5 套 · 1–3 房",
    statDist: "Landmark 81",
    statDistVal: "0.2 公里 · 3 分钟",
    statReply: "Zalo 回复",
    statReplyVal: "2 小时内",

    queryBarSub: "客户关怀团队 2 个工作小时内回复 · 支持 中文 · 越南语 · 英语",

    introEye: "公寓出租 · Landmark 与 Vinhomes Central Park",
    introTitle: "Landmark 与 Vinhomes Central Park 公寓出租",
    introBody: "Gao Ji House 在 Vinhomes Central Park 的 Landmark 1、Landmark 3、Landmark 81 以及 Park 1、Park 3 出租五套精选公寓。支持按月或按晚租赁，全套高品质家具家电齐备，租金已包含物业费、高速网络与定期保洁服务。",
    s1v: "10 分钟",
    s1l: "至第一郡 CBD",
    s2v: "每周 2 次",
    s2l: "保洁与布草更换",
    s3v: "24/7",
    s3l: "多语前台关怀",
    introCta: "查看公寓房源",
    plate1: "图 01 — 客厅与餐厅通透空间",

    unitsEye: "价格清单与户型",
    unitsTitle: "服务式公寓房源列表",
    unitsAside: "",
    lblType: "房型",
    lblFloor: "楼层",
    lblPrice: "月租范围 (越南盾/月)",
    lblBeds: "卧室数量",
    tabAll: "全部",
    tab1PN: "一室一厅",
    tab2PN: "两室一厅",
    tab3PN: "顶层复式 Penthouse",
    fAll: "所有楼层",
    fLow: "低楼层 (01–12)",
    fMid: "中楼层 (13–28)",
    fHigh: "高楼层 (29–48)",
    btnClear: "重置筛选",
    emptyEye: "未找到完全匹配房源",
    emptyBody: "Gao Ji House 在其他楼层拥有同类型房源 — 欢迎联系 Zalo 获取当日候补名单。",
    emptyCta1: "加入候补名单",
    emptyCta2: "查看全部 5 套",
    unitsNote: "租金已含物业费 · 高速宽带 · 定期保洁 · 无预订手续费",
    unitWord: "公寓",
    statusAvail: "有空房",
    statusHeld: "已预订 · 接受排队",
    cardView: "查看公寓详情",
    cardInquire: "预订 / 询价",
    u: {
      "L1.29.08": { title: "2 房 河景与 Landmark 81 景观房", type: "两室一厅 · 高楼层" },
      "P1.27.10": { title: "1 房 沐光朝河景观公寓", type: "一室一厅 · Park 1" },
      "L81.07.12": { title: "1 房 地标 81 酒店级空中套房", type: "一室一厅 · Landmark 81" },
      "P3.42.12": { title: "2 房 天然黑胡桃木雅致居所", type: "两室一厅 · 2026 新装" },
      "L3.44.09": { title: "顶层通层复式 对望地标塔", type: "三室复式 · Duplex" },
    },

    locEye: "Vinhomes Central Park · 平盛郡",
    locTitle: "优越地理位置与西贡生活圈",
    locBody: "自大堂出发的实际驾车测算时间，分别采集于西贡平峰与高峰时段。",
    tOff: "平峰时段",
    tPeak: "高峰时段",
    noteOff: "工作日 10:00–15:00 实测 · Google Maps",
    notePeak: "工作日 17:30–19:00 实测 · Google Maps",
    mins: (n: number) => n + " 分钟",
    spotEye: "周边地标",
    spotHead: "12 大西贡著名目的地",
    spotBadge: "12 大地标",
    mapTitle: "Gao Ji House · 河畔地理位置与通行半径",
    legend1: "Gao Ji 居所",
    legend2: "西贡河",
    infoWord: "地标",
    infoTail: "详情",
    distLbl: "距离",
    walk: "步行",
    drive: "驾车",
    btnDir: "路线导航",
    btnMaps: "在 Google Maps 中打开",
    plate2: "图 02 — 万豪金冠 Central Park · 西贡河",
    mapFoot: "通行半径自大堂出发测算",
    addrEye: "入住地址",
    spots: [
      { name: "Landmark 81 与 Vincom 购物中心", blurb: "越南第一高楼、观景台、国际时尚餐饮汇聚地与大型超市。" },
      { name: "14 公顷 Central Park 河畔公园", blurb: "西贡市中心最大河畔公园，拥有日式园林、锦鲤池与 1.2 公里漫步道。" },
      { name: "滨城市场与第一郡 CBD", blurb: "西贡历史文化象征，繁华商业街区、特色美食与购物胜地。" },
      { name: "市政歌剧院与阮惠步行街", blurb: "经典法式殖民建筑群、步行广场与五星级百年酒店。" },
      { name: "红教堂与百年邮政总局", blurb: "第一郡历史遗产核心区，毗邻书街咖啡文化胜地。" },
      { name: "日本街 Le Thanh Ton", blurb: "地道日式美食街、传统居酒屋与高端休闲养生会所。" },
      { name: "西贡动植物园", blurb: "历史悠久的百年植物园，市中心难得的静谧绿洲。" },
      { name: "守添新城区 (Thu Thiem)", blurb: "西贡河对岸新兴金融中心，过巴逊桥即达，绝美日落漫步地。" },
      { name: "胡志明市美术博物馆", blurb: "Art Deco 风格法式古典府邸，典藏珍贵越南艺术与雕塑。" },
      { name: "第二郡 Thao Dien 外籍社区", blurb: "多元国际社群、河畔精致西餐、精品面包店与艺术画廊。" },
      { name: "新山一国际机场", blurb: "国际航空枢纽，经由主要快速干道直达。" },
      { name: "白藤码头与西贡水上巴士", blurb: "水上巴士总站，体验河畔日落巡游与夜间游船晚宴。" },
    ],

    amEye: "园区业主尊享配套",
    amTitle: "园区配套设施与尊贵服务",
    amAside: "Gao Ji House 租客与常住业主享有同等权益 — 入住即发专属智能门禁卡。",
    a1e: "Sanctuary · 河畔静谧绿洲",
    a1t: "户外无边泳池与 14 公顷公园",
    a1b: "无边际泳池每日 6:00–21:00 开放，下楼即是 14 公顷西贡河畔大公园。",
    a1l: ["每日 6:00 – 21:00 开放", "前台提供游泳毛巾", "1.2 公里河畔慢跑步道"],
    a2e: "Wellness · 全面焕发活力",
    a2t: "Technogym 顶级健身中心",
    a2b: "配备全套意大利 Technogym 健身器材，早 5:00 至晚 23:00 免费开放。",
    a2l: ["每日 5:00 – 23:00 开放", "Technogym 器械", "瑜伽室与雪松木桑拿房"],
    a3e: "Exclusivity · 雅致私享品味",
    a3t: "品酒师精选酒窖与空中露台",
    a3b: "对望 Landmark 81 的空中露台与侍酒师甄选酒窖，需提前联系前台预约。",
    a3l: ["每日 18:00 前联系前台预约", "品酒师按季精选", "俯瞰 Landmark 81 与河景"],

    abEye: "关于我们 · 始于 2019",
    abTitle: "Gao Ji House · 房屋业主亦是直营团队",
    abP1: "Gao Ji House 于 2019 年始于 Park 1 的一套自持公寓。时至今日，团队在 Vinhomes Central Park 自持并直营五套高品质公寓——绝无中介赚取差价，不接第三方托管。每套均由我们自行设计与维护。",
    abP2: "客群主要为长期外派高管、跨国企业商务人士与外籍家庭。保洁与养护流程严格执行五星级酒店标准。",
    ab1l: "创立年份",
    ab2l: "直营公寓",
    ab3l: "核心团队",
    ab4v: "3 种语言",
    teamHead: "运营管理团队",
    teamSub: "直接沟通",
    r1l: "投资人与运营总监",
    r1b: "负责租赁合同敲定、企业长租优惠及专属定制需求。",
    r2b: "2 小时内回复消息，提供真实漫游视频、预约实地看房及接机安排。",
    r3l: "客房清洁与设施维护",
    r3n: "3 人专属自营团队",
    r3b: "每周 2 次客房保洁、布草换洗，每半年深度检测厨房电器与中央空调。",
    r4l: "合规事务与法务支持",
    r4b: "负责合同公证、正规增值税发票 (VAT) 开具及外籍人员暂住申报。",
    socEye: "社交媒体与沟通渠道",
    socBody: "最新房源实拍、即时房态及竖屏看房视频将优先在以下官方渠道发布。",
    ytSub: "Gao Ji House · 公寓实景视频",

    ctEye: "客户关怀 · 2 小时内响应",
    ctTitle: "通过 Zalo / 微信 快速预订",
    ctBody: "微信或 Zalo 沟通即可获取完整价目单、真实视频与实时房态。业主团队直接对接，无客服机器人转接。",
    chZalo: "微信 / Zalo 咨询价格",
    ctCta2: "提交预订需求",
    qrEye: "扫码快速添加微信 & Telegram",
    rowHours: "服务时间",
    hoursVal: "08:00 – 21:00 · 周一至周日",
    rowLang: "支持语言",

    trustEye: "合作背书与法务保障",
    t1Label: "空间美学",
    t1Title: "建筑设计与室内定制",
    t1Body: "融合法式印度支那与日式静谧极简风格，兼顾隔音与生活雅趣。",
    t2Label: "五星准则",
    t2Title: "五星级酒店服务标准",
    t2Body: "严格客房保洁、高温消毒洗涤及标准化验收流程。",
    t3Label: "品牌交付",
    t3Title: "严苛交付标准与名牌家电",
    t3Body: "配备博世 (Bosch)、Gaggenau、杜拉维特 (Duravit) 卫浴及洗烘一体机。",
    t4Label: "合规保障",
    t4Title: "产权清晰与税务正规",
    t4Body: "产权自持，支持合同公证、合法开具 VAT 发票及外籍暂住申报。",

    tbOta: "在 OTA 平台上获得卓越评价",
    tbCorp: "跨国企业高管的首选住宿",
    tbPay: "支持 VNPay、MoMo、Visa 支付",

    spEye: "宾客评价",
    spTitle: "真实入住体验",
    sp1: "环境安静，安保严密，内饰达到五星级酒店标准。非常适合在胡志明市的长途出差。",
    sp1a: "商务宾客，入住 3 个月",
    sp2: "公寓非常干净，厨房设施齐全。楼下的游泳池和公园非常适合孩子。",
    sp2a: "家庭客，周末度假",
    sp3: "服务一流，通过 Zalo 响应迅速。未来一定会再来。",
    sp3a: "外籍人士，入住 1 年",

    faqEye: "常见问题",
    faqTitle: "预订前须知",
    faq1q: "入住和退房时间是几点？",
    faq1a: "标准入住时间为 14:00 起，退房时间为 12:00 前。视房态情况，我们可提供提前入住或延迟退房服务。",
    faq2q: "租金包含哪些费用？",
    faq2a: "租金包含物业管理费、高速宽带以及每周两次的客房保洁。按月租赁不含水电费。",
    faq3q: "有停车位吗？",
    faq3a: "有的，Vinhomes Central Park 拥有宽敞的地下停车场。收费标准按物业管理规定执行。",
    faq4q: "可以携带宠物吗？",
    faq4a: "很遗憾，为了保持卫生并避免影响对宠物过敏的后续宾客，我们不允许携带宠物。",
    faq5q: "取消政策是什么？",
    faq5a: "短期租赁在入住前 7 天可免费取消，您的押金将全额退还。",

    ctaTitle: "准备好体验 Vinhomes Central Park 的高端生活了吗？",
    ctaBody: "立即预留您的公寓。",
    ctaBtn: "查看空房 & 询价",
  },
  tw: {
    heroEye: "Gao Ji House · 高端服務式公寓 · 萬豪金冠 Vinhomes Central Park",
    heroTitle: "歸家 · 享受靜謐雅致的私享居所",
    heroBody: "地處 Landmark 81 與西貢河畔，五套高規格精裝服務式公寓。定期清潔、24/7 前台、外籍暫住申報——一站式全包透明月租。",
    heroCta1: "查看所有房源",
    heroCta2: "立即預訂",
    statRate: "全包月租",
    statRateVal: "2400 萬越南盾起",
    statRatePer: " / 月",
    statUnits: "公寓房型",
    statUnitsVal: "5 套 · 1–3 房",
    statDist: "Landmark 81",
    statDistVal: "0.2 公里 · 3 分鐘",
    statReply: "Zalo 回覆",
    statReplyVal: "2 小時內",

    queryBarSub: "客戶關懷團隊 2 個工作小時內回覆 · 支援 中文 · 越南語 · 英語",

    introEye: "公寓出租 · Landmark 與 Vinhomes Central Park",
    introTitle: "Landmark 與 Vinhomes Central Park 公寓出租",
    introBody: "Gao Ji House 在 Vinhomes Central Park 的 Landmark 1、Landmark 3、Landmark 81 以及 Park 1、Park 3 出租五套精選公寓。支持按月或按晚租賃，全套高品質家具家電齊備，租金已包含物業費、高速網路與定期保潔服務。",
    s1v: "10 分鐘",
    s1l: "至第一郡 CBD",
    s2v: "每週 2 次",
    s2l: "清潔與布草更換",
    s3v: "24/7",
    s3l: "多語前台關懷",
    introCta: "查看公寓房源",
    plate1: "圖 01 — 客廳與餐廳通透空間",

    unitsEye: "價格清單與戶型",
    unitsTitle: "服務式公寓房源列表",
    unitsAside: "",
    lblType: "房型",
    lblFloor: "樓層",
    lblPrice: "月租範圍 (越南盾/月)",
    lblBeds: "臥室數量",
    tabAll: "全部",
    tab1PN: "一房一廳",
    tab2PN: "兩房一廳",
    tab3PN: "頂層複式 Penthouse",
    fAll: "所有樓層",
    fLow: "低樓層 (01–12)",
    fMid: "中樓層 (13–28)",
    fHigh: "高樓層 (29–48)",
    btnClear: "重置篩選",
    emptyEye: "未找到完全匹配房源",
    emptyBody: "Gao Ji House 在其他樓層擁有同類型房源 — 歡迎聯繫 Zalo 獲取當日候補名單。",
    emptyCta1: "加入候補名單",
    emptyCta2: "查看全部 5 套",
    unitsNote: "租金已含物業費 · 高速寬頻 · 定期清潔 · 無預訂手續費",
    unitWord: "公寓",
    statusAvail: "有空房",
    statusHeld: "已預訂 · 接受排隊",
    cardView: "查看公寓詳情",
    cardInquire: "預訂 / 詢價",
    u: {
      "L1.29.08": { title: "2 房 河景與 Landmark 81 景觀房", type: "兩房一廳 · 高樓層" },
      "P1.27.10": { title: "1 房 沐光朝河景觀公寓", type: "一房一廳 · Park 1" },
      "L81.07.12": { title: "1 房 地標 81 酒店級空中套房", type: "一房一廳 · Landmark 81" },
      "P3.42.12": { title: "2 房 天然黑胡桃木雅致居所", type: "兩房一廳 · 2026 新裝" },
      "L3.44.09": { title: "頂層通層複式 對望地標塔", type: "三房複式 · Duplex" },
    },

    locEye: "Vinhomes Central Park · 平盛郡",
    locTitle: "優越地理位置與西貢生活圈",
    locBody: "自大廳出發的實際駕車測算時間，分別採集於西貢離峰與高峰時段。",
    tOff: "離峰時段",
    tPeak: "尖峰時段",
    noteOff: "工作日 10:00–15:00 實測 · Google Maps",
    notePeak: "工作日 17:30–19:00 實測 · Google Maps",
    mins: (n: number) => n + " 分鐘",
    spotEye: "周邊地標",
    spotHead: "12 大西貢著名目的地",
    spotBadge: "12 大地標",
    mapTitle: "Gao Ji House · 河畔地理位置與通行半徑",
    legend1: "Gao Ji 居所",
    legend2: "西貢河",
    infoWord: "地標",
    infoTail: "詳情",
    distLbl: "距離",
    walk: "步行",
    drive: "駕車",
    btnDir: "路線導航",
    btnMaps: "在 Google Maps 中打開",
    plate2: "圖 02 — 萬豪金冠 Central Park · 西貢河",
    mapFoot: "通行半徑自大廳出發測算",
    addrEye: "入住地址",
    spots: [
      { name: "Landmark 81 與 Vincom 購物中心", blurb: "越南第一高樓、觀景台、國際時尚餐飲匯聚地與大型超市。" },
      { name: "14 公頃 Central Park 河畔公園", blurb: "西貢市中心最大河畔公園，擁有日式園林、錦鯉池與 1.2 公里漫步道。" },
      { name: "濱城市場與第一郡 CBD", blurb: "西貢歷史文化象徵，繁華商業街區、特色美食與購物勝地。" },
      { name: "市政歌劇院與阮惠步行街", blurb: "經典法式殖民建築群、步行廣場與五星級百年酒店。" },
      { name: "紅教堂與百年郵政總局", blurb: "第一郡歷史遺產核心區，毗鄰書街咖啡文化勝地。" },
      { name: "日本街 Le Thanh Ton", blurb: "地道日式美食街、傳統居酒屋與高端休閒養生會所。" },
      { name: "西貢動植物園", blurb: "歷史悠久的百年植物園，市中心難得的靜謐綠洲。" },
      { name: "守添新城區 (Thu Thiem)", blurb: "西貢河對岸新興金融中心，過巴遜橋即達，絕美日落漫步地。" },
      { name: "胡志明市美術博物館", blurb: "Art Deco 風格法式古典府邸，典藏珍貴越南藝術與雕塑。" },
      { name: "第二郡 Thao Dien 外籍社區", blurb: "多元國際社群、河畔精緻西餐、精品麵包店與藝術畫廊。" },
      { name: "新山一國際機場", blurb: "國際航空樞紐，經由主要快速幹道直達。" },
      { name: "白藤碼頭與西貢水上巴士", blurb: "水上巴士總站，體驗河畔日落巡遊與夜間遊船晚宴。" },
    ],

    amEye: "園區業主尊享配套",
    amTitle: "園區配套設施與尊貴服務",
    amAside: "Gao Ji House 租客與常住業主享有同等權益 — 入住即發專屬智慧門禁卡。",
    a1e: "Sanctuary · 河畔靜謐綠洲",
    a1t: "戶外無邊泳池與 14 公頃公園",
    a1b: "無邊際泳池每日 6:00–21:00 開放，下樓即是 14 公頃西貢河畔大公園。",
    a1l: ["每日 6:00 – 21:00 開放", "前台提供游泳毛巾", "1.2 公里河畔慢跑步道"],
    a2e: "Wellness · 全面煥發活力",
    a2t: "Technogym 頂級健身中心",
    a2b: "配備全套義大利 Technogym 健身器材，早 5:00 至晚 23:00 免費開放。",
    a2l: ["每日 5:00 – 23:00 開放", "Technogym 器械", "瑜伽室與雪松木桑拿房"],
    a3e: "Exclusivity · 雅致私享品味",
    a3t: "品酒師精選酒窖與空中露台",
    a3b: "對望 Landmark 81 的空中露台與侍酒師甄選酒窖，需提前聯繫前台預約。",
    a3l: ["每日 18:00 前聯繫前台預約", "品酒師按季精選", "俯瞰 Landmark 81 與河景"],

    abEye: "關於我們 · 始於 2019",
    abTitle: "Gao Ji House · 房屋業主亦是直營團隊",
    abP1: "Gao Ji House 於 2019 年始於 Park 1 的一套自持公寓。時至今日，團隊在 Vinhomes Central Park 自持並直營五套高品質公寓——絕無中介賺取差價，不接第三方託管。每套均由我們自行設計與維護。",
    abP2: "客群主要為長期外派高管、跨國企業商務人士與外籍家庭。清潔與養護流程嚴格執行五星級酒店標準。",
    ab1l: "創立年份",
    ab2l: "直營公寓",
    ab3l: "核心團隊",
    ab4v: "3 種語言",
    teamHead: "營運管理團隊",
    teamSub: "直接溝通",
    r1l: "投資人與營運總監",
    r1b: "負責租賃合同敲定、企業長租優惠及專屬定制需求。",
    r2b: "2 小時內回覆消息，提供真實漫遊視頻、預約實地看房及接機安排。",
    r3l: "客房清潔與設施維護",
    r3n: "3 人專屬自營團隊",
    r3b: "每週 2 次客房清潔、布草換洗，每半年深度檢測廚房電器與中央空調。",
    r4l: "合規事務與法務支援",
    r4b: "負責合同公證、正規增值稅發票 (VAT) 開具及外籍人員暫住申報。",
    socEye: "社交媒體與溝通渠道",
    socBody: "最新房源實拍、即時房態及豎屏看房視頻將優先在以下官方渠道發布。",
    ytSub: "Gao Ji House · 公寓實景視頻",

    ctEye: "客戶關懷 · 2 小時內響應",
    ctTitle: "透過 Zalo / 微信 快速預訂",
    ctBody: "微信或 Zalo 溝通即可獲取完整價目單、真實視頻與即時房態。業主團隊直接對接，無客服機器人轉接。",
    chZalo: "微信 / Zalo 諮詢價格",
    ctCta2: "提交預訂需求",
    qrEye: "掃碼快速添加微信 & Telegram",
    rowHours: "服務時間",
    hoursVal: "08:00 – 21:00 · 週一至週日",
    rowLang: "支援語言",

    trustEye: "合作背書與法務保障",
    t1Label: "空間美學",
    t1Title: "建築設計與室內定制",
    t1Body: "融合法式印度支那與日式靜謐極簡風格，兼顧隔音與生活雅趣。",
    t2Label: "五星準則",
    t2Title: "五星級酒店服務標準",
    t2Body: "嚴格客房清潔、高溫消毒洗滌及標準化驗收流程。",
    t3Label: "品牌交付",
    t3Title: "嚴苛交付標準與名牌家電",
    t3Body: "配備博世 (Bosch)、Gaggenau、杜拉維特 (Duravit) 衛浴及洗烘一體機。",
    t4Label: "合規保障",
    t4Title: "產權清晰與稅務正規",
    t4Body: "產權自持，支援合同公證、合法開具 VAT 發票及外籍暫住申報。",

    tbOta: "在 OTA 平台上獲得卓越評價",
    tbCorp: "跨國企業高管的首選住宿",
    tbPay: "支援 VNPay、MoMo、Visa 支付",

    spEye: "賓客評價",
    spTitle: "真實入住體驗",
    sp1: "環境安靜，安保嚴密，內飾達到五星級酒店標準。非常適合在胡志明市的長途出差。",
    sp1a: "商務賓客，入住 3 個月",
    sp2: "公寓非常乾淨，廚房設施齊全。樓下的游泳池和公園非常適合孩子。",
    sp2a: "家庭客，週末度假",
    sp3: "服務一流，透過 Zalo 回應迅速。未來一定會再來。",
    sp3a: "外籍人士，入住 1 年",

    faqEye: "常見問題",
    faqTitle: "預訂前須知",
    faq1q: "入住和退房時間是幾點？",
    faq1a: "標準入住時間為 14:00 起，退房時間為 12:00 前。視房態情況，我們可提供提前入住或延遲退房服務。",
    faq2q: "租金包含哪些費用？",
    faq2a: "租金包含物業管理費、高速寬頻以及每週兩次的客房清潔。按月租賃不含水電費。",
    faq3q: "有停車位嗎？",
    faq3a: "有的，Vinhomes Central Park 擁有寬敞的地下停車場。收費標準按物業管理規定執行。",
    faq4q: "可以攜帶寵物嗎？",
    faq4a: "很遺憾，為了保持衛生並避免影響對寵物過敏的後續賓客，我們不允許攜帶寵物。",
    faq5q: "取消政策是什麼？",
    faq5a: "短期租賃在入住前 7 天可免費取消，您的押金將全額退還。",

    ctaTitle: "準備好體驗 Vinhomes Central Park 的高端生活了嗎？",
    ctaBody: "立即預留您的公寓。",
    ctaBtn: "查看空房 & 詢價",
  },
};

// 5 Core Apartment Units Data
const UNITS_DATA = [
  {
    key: "L1.29.08",
    img: "/assets/photos/living-open-plan.jpg",
    flr: "29",
    tower: "Landmark 1",
    beds: 2,
    baths: 2,
    sqm: 82,
    guests: 4,
    month: 32000000,
    night: 1900000,
    status: "available",
  },
  {
    key: "P1.27.10",
    img: "/assets/photos/bedroom-single-sunlit.jpg",
    flr: "27",
    tower: "Park 1",
    beds: 1,
    baths: 1,
    sqm: 54,
    guests: 2,
    month: 24000000,
    night: 1400000,
    status: "available",
  },
  {
    key: "L81.07.12",
    img: "/assets/photos/master-bedroom.jpg",
    flr: "07",
    tower: "Landmark 81",
    beds: 1,
    baths: 1,
    sqm: 56,
    guests: 2,
    month: 38000000,
    night: 2400000,
    status: "available",
  },
  {
    key: "P3.42.12",
    img: "/assets/photos/bedroom-twin-river.jpg",
    flr: "42",
    tower: "Park 3",
    beds: 2,
    baths: 2,
    sqm: 86,
    guests: 4,
    month: 35000000,
    night: 2100000,
    status: "held",
  },
  {
    key: "L3.44.09",
    img: "/assets/photos/sky-terrace.jpg",
    flr: "44",
    tower: "Landmark 3",
    beds: 3,
    baths: 3,
    sqm: 180,
    guests: 6,
    month: 95000000,
    night: 6500000,
    status: "available",
  },
];

// 12 Location Destinations Radar Data
const SPOTS_DATA = [
  { no: "01", km: "0.2 km", off: 3, peak: 4, walk: true, q: "Landmark 81 Vinhomes Central Park", addr: "208 Nguyễn Hữu Cảnh, P.22, Bình Thạnh" },
  { no: "02", km: "0.1 km", off: 2, peak: 2, walk: true, q: "Cong vien Vinhomes Central Park", addr: "Khuôn viên ven sông Vinhomes Central Park" },
  { no: "03", km: "3.8 km", off: 10, peak: 18, walk: false, q: "Cho Ben Thanh Quan 1", addr: "Đường Lê Lợi, Phường Bến Thành, Quận 1" },
  { no: "04", km: "3.2 km", off: 9, peak: 16, walk: false, q: "Nha Hat Thanh Pho Quan 1", addr: "07 Công Trường Lam Sơn, Bến Nghé, Quận 1" },
  { no: "05", km: "3.5 km", off: 10, peak: 17, walk: false, q: "Nha Tho Duc Ba Sai Gon", addr: "01 Công Xã Paris, Bến Nghé, Quận 1" },
  { no: "06", km: "2.8 km", off: 8, peak: 14, walk: false, q: "Le Thanh Ton Quan 1", addr: "Khu phố Nhật Bản, Lê Thánh Tôn & Thái Văn Lung" },
  { no: "07", km: "2.2 km", off: 6, peak: 11, walk: false, q: "Thao Cam Vien Sai Gon", addr: "02 Nguyễn Bỉnh Khiêm, Bến Nghé, Quận 1" },
  { no: "08", km: "2.5 km", off: 7, peak: 12, walk: false, q: "Cau Ba Son Thu Thiem", addr: "Cầu Ba Son nối Bình Thạnh & KĐT Thủ Thiêm" },
  { no: "09", km: "4.2 km", off: 12, peak: 20, walk: false, q: "Bao tang My Thuat TP Ho Chi Minh", addr: "97A Phó Đức Chính, Phường Nguyễn Thái Bình, Quận 1" },
  { no: "10", km: "3.9 km", off: 11, peak: 18, walk: false, q: "Thao Dien Quan 2", addr: "Xuân Thủy, Quốc Hương, Thảo Điền, TP. Thủ Đức" },
  { no: "11", km: "8.5 km", off: 22, peak: 38, walk: false, q: "San bay Tan Son Nhat", addr: "Đường Trường Sơn, Phường 2, Tân Bình" },
  { no: "12", km: "3.0 km", off: 8, peak: 15, walk: false, q: "Ben Bach Dang Waterbus", addr: "02 Tôn Đức Thắng, Bến Nghé, Quận 1" },
];

export default function LandingPage() {
  const { lang } = useLanguage();
  const t = DICT[lang] || DICT.vi;

  // Filter States for Section 4 (Units)
  const [unitFilter, setUnitFilter] = useState("all");
  const [floorFilter, setFloorFilter] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([20000000, 100000000]);

  // Location Radar State for Section 5
  const [trafficMode, setTrafficMode] = useState<"off" | "peak">("off");
  const [selectedSpotIndex, setSelectedSpotIndex] = useState<number>(0);

  // Inquiry Modal State
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [preselectedUnit, setPreselectedUnit] = useState<string>("");

  const handleOpenInquiry = (unitCode?: string) => {
    if (unitCode) setPreselectedUnit(unitCode);
    setInquiryModalOpen(true);
  };

  // Filter Units Logic
  const filteredUnits = UNITS_DATA.filter((unit) => {
    if (unitFilter === "1pn" && unit.beds !== 1) return false;
    if (unitFilter === "2pn" && unit.beds !== 2) return false;
    if (unitFilter === "3pn" && unit.beds !== 3) return false;

    const flrNum = parseInt(unit.flr, 10);
    if (floorFilter === "low" && (flrNum < 1 || flrNum > 12)) return false;
    if (floorFilter === "mid" && (flrNum < 13 || flrNum > 28)) return false;
    if (floorFilter === "high" && flrNum < 29) return false;

    if (unit.month < priceRange[0] || unit.month > priceRange[1]) return false;
    return true;
  });

  const activeSpotData = SPOTS_DATA[selectedSpotIndex] || SPOTS_DATA[0];
  const activeSpotText = t.spots[selectedSpotIndex] || t.spots[0];
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(activeSpotData.q)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const activeDirHref = `https://maps.google.com/?daddr=${encodeURIComponent(activeSpotData.q)}`;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FBF9F5] text-[#1A1A1A]">
      {/* ── 1. HERO SECTION (Warm, Luminous & High Contrast) ── */}
      <section
        id="top"
        className="relative min-h-[calc(100vh-68px)] min-h-[calc(100dvh-72px)] flex flex-col justify-center overflow-hidden bg-[#141F1C] py-[clamp(40px,6vh,80px)]"
      >
        {/* Warm Natural Living Room Photography */}
        <Image
          src="/assets/photos/living-open-plan.jpg"
          alt="Không gian phòng khách căn hộ dịch vụ cao cấp Gao Ji House"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%]"
        />

        {/* Soft Golden Hour & Dark Jade Contrast Scrims */}
        <span
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(13, 26, 21, 0.72) 0%, rgba(13, 26, 21, 0.46) 38%, rgba(13, 26, 21, 0.92) 100%)",
          }}
        />

        {/* Hero Content Area */}
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-[clamp(20px,4vw,56px)]">
          {/* Eyebrow / Tagline */}
          <div className="flex items-center gap-3">
            <span className="w-8 h-0.5 bg-[#D4AF37]" />
            <span className="font-sans text-[0.75rem] sm:text-[0.8125rem] font-bold uppercase tracking-[0.2em] text-[#E2C068] drop-shadow-sm">
              {t.heroEye}
            </span>
          </div>

          {/* Primary Visual Anchor: Clear, Crisp Title Case Headline */}
          <h1
            className="mt-4 max-w-[20ch] font-display text-[clamp(2.4rem,2rem+2.2vw,4.4rem)] font-medium leading-[1.18]"
            style={{
              color: "#FFFFFF",
              textShadow: "0 2px 16px rgba(0,0,0,0.85), 0 0 2px rgba(0,0,0,0.9)",
            }}
          >
            {t.heroTitle}
          </h1>

          {/* Clean, Readable Body Description */}
          <p
            className="mt-5 max-w-[56ch] font-sans text-base sm:text-[1.125rem] leading-[1.75]"
            style={{
              color: "#FAF3EA",
              textShadow: "0 1px 8px rgba(0,0,0,0.8)",
            }}
          >
            {t.heroBody}
          </p>

          {/* High-Contrast Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              variant="gold"
              size="lg"
              icon="calendar-check"
              onClick={() => handleOpenInquiry()}
              style={{ minWidth: 230 }}
            >
              {t.heroCta2}
            </Button>
            <Button
              variant="outline"
              size="lg"
              iconAfter="arrow-right"
              as="a"
              href="#units"
              className="!bg-white/15 !text-white hover:!bg-white/25 !border-white/40 !backdrop-blur-md shadow-md"
              style={{ minWidth: 250 }}
            >
              {t.heroCta1}
            </Button>
          </div>
        </div>
      </section>


      {/* ── 2. EDITORIAL SHOWCASE (Trải Nghiệm Lưu Trú Đỉnh Cao) */}
      <section className="py-[clamp(44px,5.5vw,88px)] px-[clamp(20px,4vw,56px)] bg-[#FBF9F5]">
        <div className="max-w-[1240px] mx-auto grid gap-[clamp(32px,5vw,72px)] grid-cols-1 md:grid-cols-2 items-center">
          {/* Left: Clean Luxury Gold Frame Box (No awkward red/clay box) */}
          <div className="relative">
            {/* Elegant 12px gold offset frame */}
            <span
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                transform: "translate(-10px, 10px)",
                border: "1px solid #B08D57",
              }}
            />

            <div className="relative bg-white border border-[#E8E4DB] p-[clamp(28px,4vw,44px)] shadow-xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-px bg-[#B08D57]" />
                <span className="font-sans text-[0.75rem] font-bold uppercase tracking-[0.15em] text-[#8A6214]">
                  {t.introEye}
                </span>
              </div>

              <h2 className="mt-4 font-display text-[clamp(1.9rem,1.7rem+1vw,2.8rem)] font-medium leading-[1.2] text-[#1A1A1A]">
                {t.introTitle}
              </h2>

              <p className="mt-5 max-w-[48ch] font-sans text-[1.08rem] leading-[1.7] text-[#383838]">
                {t.introBody}
              </p>
            </div>
          </div>

          {/* Right: Signature Vertical PhotoPlate */}
          <PhotoPlate
            src="/assets/photos/living-dining.jpg"
            alt="Khu vực khách và bàn ăn liên thông trong căn hộ Gao Ji House"
            ratio="4 / 5"
            offset="right"

          />
        </div>
      </section>

      {/* ── 4. RESIDENCE APARTMENT COLLECTION (Danh Sách Căn Hộ) */}
      <section
        id="units"
        className="py-[clamp(56px,7vw,112px)] px-[clamp(20px,4vw,56px)] bg-[#FAF8F5]"
      >
        <div className="max-w-[1600px] mx-auto">
          <SectionHeader
            eyebrow={t.unitsEye}
            title={t.unitsTitle}
            aside={t.unitsAside}
          />

          {/* Multi-Filter Bar */}
          <div className="mt-7 border border-[#E8E4DB] bg-white shadow-xs">
            <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-[#E8E4DB]">
              {/* Col 1: Unit Type Tabs */}
              <div className="flex-1 p-4 sm:p-5 flex flex-col gap-3">
              <span className="min-w-[120px] font-sans text-xs font-semibold uppercase tracking-[0.15em] text-[#6B6255]">
                {t.lblType}
              </span>
              <FilterTabs
                tabs={[
                  { label: t.tabAll, value: "all" },
                  { label: t.tab1PN, value: "1pn" },
                  { label: t.tab2PN, value: "2pn" },
                  { label: t.tab3PN, value: "3pn" },
                ]}
                value={unitFilter}
                onChange={(val) => setUnitFilter(String(val))}
              />
              </div>

              {/* Col 2: Floor Level Tabs */}
              <div className="flex-1 p-4 sm:p-5 flex flex-col gap-3">
              <span className="min-w-[120px] font-sans text-xs font-semibold uppercase tracking-[0.15em] text-[#6B6255]">
                {t.lblFloor}
              </span>
              <FilterTabs
                tabs={[
                  { label: t.fAll, value: "all" },
                  { label: t.fLow, value: "low" },
                  { label: t.fMid, value: "mid" },
                  { label: t.fHigh, value: "high" },
                ]}
                value={floorFilter}
                onChange={(val) => setFloorFilter(String(val))}
              />
              </div>

              {/* Col 3: Price Dual Slider */}
              <div className="flex-1 p-4 sm:p-5 flex flex-col gap-3">
              <span className="min-w-[120px] font-sans text-xs font-semibold uppercase tracking-[0.15em] text-[#6B6255]">
                {t.lblPrice}
              </span>
              <div className="flex-1 min-w-[240px] max-w-[520px] flex items-center gap-4">
                <input
                  type="range"
                  min="20000000"
                  max="100000000"
                  step="5000000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full accent-[#1F3A2E] cursor-pointer"
                />
                <span className="font-display text-base font-medium text-[#1F3A2E] shrink-0 min-w-[110px]">
                  ≤ {(priceRange[1] / 1000000).toFixed(0)} Triệu / tháng
                </span>
              </div>
            </div>
            </div>

            {/* Summary Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4.5 bg-[#FAF8F5] border-t border-[#E8E4DB]">
              <span className="font-sans text-xs sm:text-[0.8125rem] font-semibold uppercase tracking-[0.15em] text-[#1A1A1A]">
                Hiển thị {filteredUnits.length} / {UNITS_DATA.length} căn hộ khả dụng
              </span>
              <button
                type="button"
                onClick={() => {
                  setUnitFilter("all");
                  setFloorFilter("all");
                  setPriceRange([20000000, 100000000]);
                }}
                className="px-3.5 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#8A6214] border border-[#B08D57] hover:bg-[#B08D57] hover:text-white transition-colors cursor-pointer bg-transparent"
              >
                {t.btnClear}
              </button>
            </div>
          </div>

          {/* Units Grid (3 Columns) */}
          <div className="mt-7 grid gap-[clamp(20px,2vw,28px)] grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredUnits.map((u) => {
              const uMeta = t.u[u.key as keyof typeof t.u];
              return (
                <UnitCard
                  key={u.key}
                  unit={{
                    id: u.key,
                    unit_code: `${t.unitWord} ${u.key}`,
                    name: uMeta ? uMeta.title : u.key,
                    cover_image: u.img,
                    floor: u.flr,
                    tower: u.tower,
                    bedrooms: u.beds,
                    bathrooms: u.baths,
                    sqm: u.sqm,
                    price_monthly: u.month,
                    price_nightly: u.night,
                    status: u.status,
                    view_type: uMeta ? uMeta.type : undefined,
                  }}
                  labels={{
                    view: t.cardView,
                    inquire: t.cardInquire,
                    month: "Giá Thuê Tháng",
                    night: "Giá Theo Đêm",
                  }}
                  onInquire={(code) => handleOpenInquiry(code)}
                />
              );
            })}
          </div>

          {/* Empty State */}
          {filteredUnits.length === 0 && (
            <div className="mt-7 border border-[#E8E4DB] bg-[#FAF8F5] p-[clamp(28px,4vw,48px)] grid gap-3.5 justify-items-start">
              <span className="inline-flex items-center gap-3 font-sans text-xs font-semibold uppercase tracking-[0.15em] text-[#8A6214]">
                <span className="w-8 h-px bg-[#B08D57]" />
                {t.emptyEye}
              </span>
              <p className="m-0 font-display text-2xl leading-snug">
                {t.emptyBody}
              </p>
              <div className="flex flex-wrap gap-3 mt-2">
                <Button
                  variant="jade"
                  icon="calendar-check"
                  onClick={() => handleOpenInquiry()}
                >
                  {t.emptyCta1}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setUnitFilter("all");
                    setFloorFilter("all");
                    setPriceRange([20000000, 100000000]);
                  }}
                >
                  {t.emptyCta2}
                </Button>
              </div>
            </div>
          )}

          <p className="mt-6 font-sans text-xs sm:text-[0.8125rem] font-semibold uppercase tracking-[0.15em] text-[#6B6255]">
            {t.unitsNote}
          </p>
        </div>
      </section>

      {/* ── 5. LOCATION & TRAVEL RADAR (Vị Trí & Bán Kính Kết Nối) */}
      <section
        id="location"
        className="py-[clamp(56px,7vw,112px)] px-[clamp(20px,4vw,56px)] bg-[#FBF9F5]"
      >
        <div className="max-w-[1240px] mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-6 pb-2">
            <div className="flex-1 min-w-[320px]">
              <div className="flex items-center gap-3">
                <span className="w-8 h-px bg-[#B08D57]" />
                <span className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-[#8A6214]">
                  {t.locEye}
                </span>
              </div>
              <h2 className="mt-4 font-display text-[clamp(1.9rem,1.7rem+1vw,2.8rem)] font-medium leading-[1.2] text-[#1A1A1A]">
                {t.locTitle}
              </h2>
              <p className="mt-5 max-w-[52ch] font-sans text-[1.08rem] leading-[1.7] text-[#383838]">
                {t.locBody}
              </p>
            </div>

            <div className="flex flex-col items-start gap-3">
              <span className="px-3.5 py-2 bg-[#1F3A2E] text-[#FAF3EA] font-sans text-xs font-semibold uppercase tracking-[0.15em]">
                {t.spotBadge}
              </span>
              <FilterTabs
                tabs={[
                  { label: t.tOff, value: "off" },
                  { label: t.tPeak, value: "peak" },
                ]}
                value={trafficMode}
                onChange={(val) => setTrafficMode(val as "off" | "peak")}
              />
            </div>
          </div>

          <div className="mt-[clamp(28px,3.5vw,44px)] grid gap-[clamp(20px,2vw,28px)] grid-cols-1 lg:grid-cols-12 items-start">
            {/* Left: 12 Spots List */}
            <div className="lg:col-span-6 border border-[#E8E4DB] bg-white shadow-xs">
              <div className="p-4 sm:p-5 border-b border-[#E8E4DB]">
                <span className="inline-flex items-center gap-3 font-sans text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-[#8A6214]">
                  <span className="w-6 h-px bg-[#B08D57]" />
                  {t.spotEye}
                </span>
                <h3 className="mt-2 font-display text-2xl font-medium leading-[1.2] text-[#1A1A1A]">
                  {t.spotHead}
                </h3>
              </div>

              {/* Scrollable list of 12 spots */}
              <div className="max-h-[430px] overflow-y-auto p-3 grid gap-2">
                {SPOTS_DATA.map((p, idx) => {
                  const on = selectedSpotIndex === idx;
                  const spotText = t.spots[idx] || t.spots[0];
                  const time = trafficMode === "off" ? `${p.off} phút` : `${p.peak} phút`;
                  return (
                    <button
                      key={p.no}
                      type="button"
                      onClick={() => setSelectedSpotIndex(idx)}
                      className={`w-full p-3 flex items-center gap-3.5 text-left transition-colors cursor-pointer rounded-none border ${
                        on
                          ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                          : "bg-white text-[#1A1A1A] border-[#E8E4DB] hover:border-[#B08D57]"
                      }`}
                    >
                      <span
                        className={`flex-none w-[34px] h-[34px] grid place-items-center font-sans text-xs font-bold tracking-wider border ${
                          on
                            ? "border-[#D4AF37] text-[#D4AF37]"
                            : "border-[#E8E4DB] text-[#6B6255]"
                        }`}
                      >
                        {p.no}
                      </span>
                      <div className="grid gap-1 text-left min-w-0 flex-1">
                        <span
                          className={`font-display italic text-[1.08rem] leading-tight truncate ${
                            on ? "text-[#FAF3EA]" : "text-[#1A1A1A]"
                          }`}
                        >
                          {spotText.name}
                        </span>
                        <span
                          className={`font-sans text-[0.6875rem] font-semibold tracking-[0.15em] uppercase ${
                            on ? "text-[rgba(250,243,234,0.72)]" : "text-[#6B6255]"
                          }`}
                        >
                          {t.distLbl}: {p.km}
                        </span>
                      </div>
                      <span
                        className={`flex-none ml-auto px-2.5 py-1.5 font-sans text-[0.6875rem] font-semibold tracking-wider uppercase border ${
                          on
                            ? "bg-[#A6573C] text-white border-transparent"
                            : "bg-transparent text-[#1A1A1A] border-[#E8E4DB]"
                        }`}
                      >
                        {time}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Spot Details Box */}
              <div className="m-3 border border-[#E8E4DB] bg-[#FAF8F5] p-4 grid gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <span className="inline-flex items-center gap-2 font-sans text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-[#8A6214]">
                    <Icon name="map-pin" size={15} color="currentColor" />
                    <span>{t.infoWord} #{activeSpotData.no} · {t.infoTail}</span>
                  </span>
                  <span className="bg-[#1A1A1A] text-[#FAF3EA] px-2.5 py-1 font-sans text-[0.6875rem] font-semibold uppercase tracking-wider">
                    {activeSpotData.km} · {trafficMode === "off" ? activeSpotData.off : activeSpotData.peak} {t.mins(trafficMode === "off" ? activeSpotData.off : activeSpotData.peak)} {activeSpotData.walk ? t.walk : t.drive}
                  </span>
                </div>
                <p className="m-0 font-sans text-[0.9375rem] leading-relaxed text-[#383838]">
                  {activeSpotText.blurb}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-[#E8E4DB]">
                  <span className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.15em] text-[#6B6255]">
                    {activeSpotData.addr}
                  </span>
                  <a
                    href={activeDirHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-sans text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-[#8A6214] hover:underline"
                  >
                    <span>{t.btnDir}</span>
                    <Icon name="arrow-right" size={15} color="currentColor" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Map Box */}
            <div className="lg:col-span-6 border border-[#1A1A1A] bg-white p-[clamp(14px,1.4vw,20px)] grid gap-3.5 shadow-xs">
              <div className="grid gap-2">
                <span className="inline-flex items-center gap-2.5 font-display text-[1.15rem] leading-snug text-[#1A1A1A]">
                  <Icon name="map-pin" size={18} color="#8A6214" />
                  <span>{t.mapTitle}</span>
                </span>
                <div className="flex flex-wrap gap-4">
                  <span className="inline-flex items-center gap-2 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.15em] text-[#6B6255]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#A6573C]" />
                    <span>{t.legend1}</span>
                  </span>
                  <span className="inline-flex items-center gap-2 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.15em] text-[#6B6255]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1F3A2E]" />
                    <span>{t.legend2}</span>
                  </span>
                </div>
              </div>

              {/* Map Iframe */}
              <div className="relative border border-[#E8E4DB] bg-[#FAF8F5] min-h-[clamp(360px,42vw,520px)]">
                <iframe
                  src={mapSrc}
                  title={t.mapTitle}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full border-0 block"
                />
                <a
                  href={activeDirHref}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-4 right-4 inline-flex items-center gap-2.5 bg-[#1A1A1A] hover:bg-[#0D3B22] border border-[#D4AF37] text-white px-4 py-3 min-h-[44px] no-underline font-sans text-xs font-semibold uppercase tracking-[0.15em] transition-colors shadow-lg"
                >
                  <span>{t.btnMaps}</span>
                  <Icon name="arrow-right" size={15} color="currentColor" />
                </a>
              </div>

              <div className="flex flex-wrap items-baseline justify-between gap-4 font-sans text-xs text-[#6B6255]">
                <span className="italic font-serif">{trafficMode === "peak" ? t.notePeak : t.noteOff}</span>
                <span className="font-semibold uppercase tracking-[0.15em]">{t.mapFoot}</span>
              </div>
            </div>
          </div>

          {/* Lower Row: Skyline PhotoPlate & Address Inset Box */}
          <div className="mt-[clamp(40px,5vw,72px)] grid gap-[clamp(28px,3.5vw,56px)] grid-cols-1 md:grid-cols-2 items-center">
            {/* Skyline Photo */}
            <div className="relative pr-3 pb-3">
              <span
                aria-hidden="true"
                className="absolute left-3 top-3 right-0 bottom-0 border border-[#D4AF37] pointer-events-none"
              />
              <div className="relative bg-[#FAF8F5] border border-[#1F3A2E] p-[clamp(16px,2vw,30px)]">
                <div className="relative border border-[#1F3A2E] aspect-[4/3] overflow-hidden">
                  <Image
                    src="/assets/photos/towers-skyline.jpg"
                    alt="Tranh vẽ cụm toà tháp Vinhomes Central Park bên sông Sài Gòn"
                    fill
                    className="object-cover object-[50%_40%] sepia-[0.18] contrast-[1.14] saturate-[0.72] brightness-[1.04]"
                  />
                </div>
                <div className="mt-3.5 flex flex-wrap items-baseline justify-between gap-3 font-sans text-xs font-semibold uppercase tracking-[0.15em]">
                  <span className="text-[#8A6214]">{t.plate2}</span>
                  <span className="font-display italic text-[0.9375rem] text-[#6B6255] lowercase tracking-normal">{t.mapFoot}</span>
                </div>
              </div>
            </div>

            {/* Address Box in Jade-700 */}
            <div className="bg-[#1F3A2E] border border-[#D4AF37] p-[clamp(24px,2.8vw,36px)] grid gap-3.5 justify-items-start text-white shadow-md">
              <div className="flex items-center gap-3">
                <span className="w-8 h-px bg-[#D4AF37]" />
                <span className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-[#E2C068]">
                  {t.addrEye}
                </span>
              </div>
              <p className="m-0 max-w-[34ch] font-display text-[clamp(1.3rem,1.1rem+0.7vw,1.75rem)] leading-[1.28] text-white">
                208 Nguyễn Hữu Cảnh, Phường 22, Bình Thạnh, TP. Hồ Chí Minh
              </p>
              <Button
                variant="onDark"
                icon="map-pin"
                as="a"
                href="https://maps.google.com/?q=Vinhomes+Central+Park+208+Nguyen+Huu+Canh"
                target="_blank"
                rel="noreferrer"
              >
                {t.btnMaps}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. RESIDENT AMENITIES (Tiện Ích & Dịch Vụ Cư Dân) ── */}
      <section
        id="amenities"
        className="py-[clamp(56px,7vw,112px)] px-[clamp(20px,4vw,56px)] bg-[#FAF8F5]"
      >
        <div className="max-w-[1600px] mx-auto">
          <SectionHeader
            eyebrow={t.amEye}
            title={t.amTitle}
            aside={t.amAside}
          />

          <div className="mt-[clamp(32px,4vw,48px)] grid gap-[clamp(20px,2vw,28px)] grid-cols-1 md:grid-cols-3">
            <FeatureCard
              image="/assets/photos/pool-aerial.jpg"
              imageAlt="Hồ bơi nội khu ven sông"
              imageRatio="16 / 10"
              icon="sun"
              eyebrow={t.a1e}
              title={t.a1t}
              bullets={t.a1l}
              tone="warm"
            >
              {t.a1b}
            </FeatureCard>

            <FeatureCard
              image="/assets/photos/gym.webp"
              imageAlt="Phòng gym nội khu với thiết bị Technogym"
              imageRatio="16 / 10"
              icon="dumbbell"
              eyebrow={t.a2e}
              title={t.a2t}
              bullets={t.a2l}
              tone="warm"
            >
              {t.a2b}
            </FeatureCard>

            <FeatureCard
              image="/assets/photos/sky-terrace.jpg"
              imageAlt="Sân thượng ngắm cảnh và hầm rượu"
              imageRatio="16 / 10"
              icon="wine"
              eyebrow={t.a3e}
              title={t.a3t}
              bullets={t.a3l}
              tone="warm"
            >
              {t.a3b}
            </FeatureCard>
          </div>
        </div>
      </section>


      {/* ── 6.5. SOCIAL PROOF (NEW) ── */}
      <section className="bg-[#FBF9F5] border-t border-[#E8E4DB] py-[clamp(60px,8vh,100px)]">
        <div className="max-w-[1600px] mx-auto px-[clamp(20px,4vw,56px)]">
          <SectionHeader
            eyebrow={t.spEye}
            title={t.spTitle}
          />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { q: t.sp1, a: t.sp1a },
              { q: t.sp2, a: t.sp2a },
              { q: t.sp3, a: t.sp3a }
            ].map((review, i) => (
              <div key={i} className="bg-[#FAF8F5] p-8 rounded-none border border-[#E8E4DB] flex flex-col justify-between shadow-xs">
                <div>
                  <Quote className="w-8 h-8 text-[#D4AF37]/50 mb-6" />
                  <p className="font-sans text-[15px] leading-relaxed text-[#383838]">&quot;{review.q}&quot;</p>
                </div>
                <div className="mt-8 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E8E4DB] flex items-center justify-center text-[#0D3B22] font-semibold">
                    {review.a.charAt(0)}
                  </div>
                  <span className="font-sans text-sm font-medium text-[#0D3B22]">{review.a}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. ABOUT US & OPERATING TEAM (Về Chúng Tôi) ─────── */}
      <section
        id="about"
        className="py-[clamp(56px,7vw,112px)] px-[clamp(20px,4vw,56px)] bg-[#FBF9F5]"
      >
        <div className="max-w-[1240px] mx-auto">
          <div className="grid gap-[clamp(32px,4vw,64px)] grid-cols-1 lg:grid-cols-12 items-start">
            {/* Left Story & Stats */}
            <div className="lg:col-span-7 grid gap-5 justify-items-start">
              <div className="flex items-center gap-3">
                <span className="w-8 h-px bg-[#B08D57]" />
                <span className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-[#8A6214]">
                  {t.abEye}
                </span>
              </div>

              <h2 className="m-0 max-w-[24ch] font-display text-[clamp(1.6rem,1.4rem+0.8vw,2.3rem)] font-medium leading-[1.25] text-[#1A1A1A]">
                {t.abTitle}
              </h2>

              <p className="m-0 max-w-[56ch] font-sans text-[1.08rem] leading-[1.7] text-[#383838]">
                {t.abP1}
              </p>

              <p className="m-0 max-w-[56ch] font-sans text-[1.08rem] leading-[1.7] text-[#383838]">
                {t.abP2}
              </p>

              {/* 4 Stats Grid */}
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#E8E4DB] border border-[#E8E4DB] w-full">
                <div className="bg-[#FAF8F5] p-4 sm:p-5 grid gap-1.5">
                  <span className="font-display text-[1.75rem] font-medium leading-none text-[#0D3B22]">2019</span>
                  <span className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.15em] text-[#6B6255]">{t.ab1l}</span>
                </div>
                <div className="bg-[#FAF8F5] p-4 sm:p-5 grid gap-1.5">
                  <span className="font-display text-[1.75rem] font-medium leading-none text-[#0D3B22]">05</span>
                  <span className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.15em] text-[#6B6255]">{t.ab2l}</span>
                </div>
                <div className="bg-[#FAF8F5] p-4 sm:p-5 grid gap-1.5">
                  <span className="font-display text-[1.75rem] font-medium leading-none text-[#0D3B22]">06</span>
                  <span className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.15em] text-[#6B6255]">{t.ab3l}</span>
                </div>
                <div className="bg-[#FAF8F5] p-4 sm:p-5 grid gap-1.5">
                  <span className="font-display text-[1.75rem] font-medium leading-none text-[#0D3B22]">{t.ab4v}</span>
                  <span className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.15em] text-[#6B6255]">Việt · English · 中文</span>
                </div>
              </div>
            </div>

            {/* Right Team Table */}
            <div className="lg:col-span-5 border border-[#E8E4DB] bg-white shadow-xs">
              <div className="p-4 sm:p-5 border-b border-[#E8E4DB] bg-[#FAF8F5] flex items-baseline justify-between gap-4">
                <span className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-[#0D3B22]">{t.teamHead}</span>
                <span className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.15em] text-[#6B6255]">{t.teamSub}</span>
              </div>
              <div className="p-5 border-b border-[#E8E4DB] grid gap-2">
                <span className="font-sans text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-[#8A6214]">{t.r1l}</span>
                <span className="font-display text-[1.35rem] font-medium leading-none text-[#1A1A1A]">Lâm Lợi</span>
                <p className="m-0 font-sans text-sm leading-[1.6] text-[#383838]">{t.r1b}</p>
              </div>
              <div className="p-5 border-b border-[#E8E4DB] grid gap-2">
                <span className="font-sans text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-[#8A6214]">Guest Relations · Zalo & WeChat</span>
                <span className="font-display text-[1.35rem] font-medium leading-none text-[#1A1A1A]">Trần Mỹ Duyên</span>
                <p className="m-0 font-sans text-sm leading-[1.6] text-[#383838]">{t.r2b}</p>
              </div>
              <div className="p-5 border-b border-[#E8E4DB] grid gap-2">
                <span className="font-sans text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-[#8A6214]">{t.r3l}</span>
                <span className="font-display text-[1.35rem] font-medium leading-none text-[#1A1A1A]">{t.r3n}</span>
                <p className="m-0 font-sans text-sm leading-[1.6] text-[#383838]">{t.r3b}</p>
              </div>
              <div className="p-5 grid gap-2">
                <span className="font-sans text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-[#8A6214]">{t.r4l}</span>
                <span className="font-display text-[1.35rem] font-medium leading-none text-[#1A1A1A]">Nguyễn Thanh Hà</span>
                <p className="m-0 font-sans text-sm leading-[1.6] text-[#383838]">{t.r4b}</p>
              </div>
            </div>
          </div>

          {/* Social Channels Strip */}
          <div className="mt-[clamp(28px,3.4vw,48px)] bg-white border border-[#E8E4DB] p-[clamp(24px,2.8vw,36px)] grid gap-[clamp(20px,2.4vw,32px)] grid-cols-1 lg:grid-cols-12 items-center shadow-xs">
            <div className="lg:col-span-4 grid gap-2.5 justify-items-start">
              <div className="flex items-center gap-3">
                <span className="w-8 h-px bg-[#B08D57]" />
                <span className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-[#8A6214]">{t.socEye}</span>
              </div>
              <p className="m-0 font-sans text-sm leading-relaxed text-[#383838]">{t.socBody}</p>
            </div>

            <div className="lg:col-span-8 grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
              <a href="https://zalo.me/0889237833" target="_blank" rel="noreferrer" className="border border-[#E8E4DB] bg-[#FAF8F5] p-3.5 grid gap-1 no-underline hover:border-[#D4AF37] hover:bg-white transition-colors">
                <span className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-[#0D3B22]">Zalo</span>
                <span className="font-sans text-xs text-[#6B6255]">088 923 7833</span>
              </a>
              <a href="https://facebook.com/gaojihouse" target="_blank" rel="noreferrer" className="border border-[#E8E4DB] bg-[#FAF8F5] p-3.5 grid gap-1 no-underline hover:border-[#D4AF37] hover:bg-white transition-colors">
                <span className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-[#0D3B22]">Facebook</span>
                <span className="font-sans text-xs text-[#6B6255]">fb.com/gaojihouse</span>
              </a>
              <a href="https://instagram.com/gaojihouse" target="_blank" rel="noreferrer" className="border border-[#E8E4DB] bg-[#FAF8F5] p-3.5 grid gap-1 no-underline hover:border-[#D4AF37] hover:bg-white transition-colors">
                <span className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-[#0D3B22]">Instagram</span>
                <span className="font-sans text-xs text-[#6B6255]">@gaojihouse</span>
              </a>
              <a href="https://youtube.com/@gaojihouse" target="_blank" rel="noreferrer" className="border border-[#E8E4DB] bg-[#FAF8F5] p-3.5 grid gap-1 no-underline hover:border-[#D4AF37] hover:bg-white transition-colors">
                <span className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-[#0D3B22]">YouTube</span>
                <span className="font-sans text-xs text-[#6B6255]">{t.ytSub}</span>
              </a>
              <a href="weixin://dl/chat?HZM81MS" className="border border-[#E8E4DB] bg-[#FAF8F5] p-3.5 grid gap-1 no-underline hover:border-[#D4AF37] hover:bg-white transition-colors">
                <span className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-[#0D3B22]">WeChat</span>
                <span className="font-sans text-xs text-[#6B6255]">HZM81MS</span>
              </a>
              <a href="https://t.me/HZM81MS" target="_blank" rel="noreferrer" className="border border-[#E8E4DB] bg-[#FAF8F5] p-3.5 grid gap-1 no-underline hover:border-[#D4AF37] hover:bg-white transition-colors">
                <span className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-[#0D3B22]">Telegram</span>
                <span className="font-sans text-xs text-[#6B6255]">@HZM81MS</span>
              </a>
              <a href="mailto:stay@gaojihouse.vn" className="border border-[#E8E4DB] bg-[#FAF8F5] p-3.5 grid gap-1 no-underline hover:border-[#D4AF37] hover:bg-white transition-colors col-span-2 sm:col-span-1">
                <span className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-[#0D3B22]">Email</span>
                <span className="font-sans text-xs text-[#6B6255]">stay@gaojihouse.vn</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. TRUST, LEGAL & DIRECT ZALO CONTACT ───────────── */}
      {/* Legal & Trust Standards (4-Column Bar) */}
      <section className="bg-[#141F1C] py-[clamp(48px,6vw,88px)] px-[clamp(20px,4vw,56px)] text-white border-t border-[rgba(212,175,55,0.25)]">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-[#D4AF37]" />
            <span className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-[#E2C068]">
              {t.trustEye}
            </span>
          </div>

          <div className="mt-7 grid gap-px grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-[rgba(250,243,234,0.12)] border border-[rgba(250,243,234,0.12)]">
            <div className="bg-[#141F1C] p-6 sm:p-7 grid gap-2.5">
              <Icon name="palette" size={22} color="#D4AF37" />
              <span className="font-sans text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-[#E2C068]">
                {t.t1Label}
              </span>
              <h3 className="font-display text-lg text-white">
                {t.t1Title}
              </h3>
              <p className="m-0 font-sans text-xs sm:text-sm leading-relaxed text-[rgba(250,243,234,0.78)]">
                {t.t1Body}
              </p>
            </div>

            <div className="bg-[#141F1C] p-6 sm:p-7 grid gap-2.5">
              <Icon name="award" size={22} color="#D4AF37" />
              <span className="font-sans text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-[#E2C068]">
                {t.t2Label}
              </span>
              <h3 className="font-display text-lg text-white">
                {t.t2Title}
              </h3>
              <p className="m-0 font-sans text-xs sm:text-sm leading-relaxed text-[rgba(250,243,234,0.78)]">
                {t.t2Body}
              </p>
            </div>

            <div className="bg-[#141F1C] p-6 sm:p-7 grid gap-2.5">
              <Icon name="check-circle" size={22} color="#D4AF37" />
              <span className="font-sans text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-[#E2C068]">
                {t.t3Label}
              </span>
              <h3 className="font-display text-lg text-white">
                {t.t3Title}
              </h3>
              <p className="m-0 font-sans text-xs sm:text-sm leading-relaxed text-[rgba(250,243,234,0.78)]">
                {t.t3Body}
              </p>
            </div>

            <div className="bg-[#141F1C] p-6 sm:p-7 grid gap-2.5">
              <Icon name="file-text" size={22} color="#D4AF37" />
              <span className="font-sans text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-[#E2C068]">
                {t.t4Label}
              </span>
              <h3 className="font-display text-lg text-white">
                {t.t4Title}
              </h3>
              <p className="m-0 font-sans text-xs sm:text-sm leading-relaxed text-[rgba(250,243,234,0.78)]">
                {t.t4Body}
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* ── 9.5. FAQ SECTION (NEW) ── */}
      <section className="bg-[#FAF8F5] py-[clamp(60px,8vh,100px)]">
        <div className="max-w-[900px] mx-auto px-[clamp(20px,4vw,56px)]">
          <div className="text-center mb-12">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-[#8A6214] block mb-3">
              {t.faqEye}
            </span>
            <h2 className="font-display text-[clamp(1.75rem,2vw+1rem,2.5rem)] font-medium text-[#0D3B22]">
              {t.faqTitle}
            </h2>
          </div>
          <Accordion>
            <AccordionItem title={t.faq1q} defaultOpen={true}>
              {t.faq1a}
            </AccordionItem>
            <AccordionItem title={t.faq2q}>
              {t.faq2a}
            </AccordionItem>
            <AccordionItem title={t.faq3q}>
              {t.faq3a}
            </AccordionItem>
            <AccordionItem title={t.faq4q}>
              {t.faq4a}
            </AccordionItem>
            <AccordionItem title={t.faq5q}>
              {t.faq5a}
            </AccordionItem>
          </Accordion>
        </div>
      </section>


      {/* ── 9.6. FINAL CTA (NEW) ── */}
      <section className="bg-[#0D3B22] py-[clamp(60px,8vh,100px)] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-10" style={{ background: "url('/assets/photos/living-open-plan.jpg') center/cover" }} />
        <div className="relative z-10 max-w-[900px] mx-auto px-[clamp(20px,4vw,56px)] text-center">
          <h2 className="font-display text-[clamp(2rem,3vw+1rem,3.5rem)] font-medium text-white mb-6 leading-tight">
            {t.ctaTitle}
          </h2>
          <p className="font-sans text-white/80 text-lg mb-10">
            {t.ctaBody}
          </p>
          <Button
            variant="gold"
            size="lg"
            iconAfter="arrow-right"
            onClick={() => handleOpenInquiry()}
            style={{ minWidth: 250 }}
            className="mx-auto"
          >
            {t.ctaBtn}
          </Button>
        </div>
      </section>

      {/* Direct Zalo Booking Box */}
      <section
        id="contact"
        className="py-[clamp(56px,7vw,112px)] px-[clamp(20px,4vw,56px)] bg-[#FAF8F5]"
      >
        <div className="max-w-[1240px] mx-auto bg-[#1F3A2E] border border-[#D4AF37] p-[clamp(32px,4.5vw,64px)] grid gap-[clamp(28px,4vw,56px)] grid-cols-1 md:grid-cols-2 items-start text-white shadow-2xl">
          <div className="grid gap-4 justify-items-start">
            <div className="flex items-center gap-3">
              <span className="w-8 h-px bg-[#D4AF37]" />
              <span className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-[#E2C068]">{t.ctEye}</span>
            </div>
            <h2 className="m-0 max-w-[22ch] font-display text-[clamp(1.6rem,1.4rem+0.8vw,2.3rem)] font-medium leading-[1.25] text-white">
              {t.ctTitle}
            </h2>
            <p className="m-0 max-w-[52ch] font-sans text-[1.05rem] leading-[1.65] text-[rgba(250,243,234,0.85)]">
              {t.ctBody}
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <Button
                variant="gold"
                size="lg"
                icon="phone"
                as="a"
                href="https://zalo.me/0889237833"
                target="_blank"
                rel="noreferrer"
              >
                {t.chZalo}
              </Button>
              <Button
                variant="onDark"
                size="lg"
                icon="calendar-check"
                onClick={() => handleOpenInquiry()}
              >
                {t.ctCta2}
              </Button>
            </div>

            {/* QR Codes for WeChat & Telegram */}
            <div className="w-full mt-2 pt-5 border-t border-[rgba(212,175,55,0.35)] grid gap-3.5">
              <div className="flex items-center gap-3 font-sans text-xs font-bold uppercase tracking-[0.15em] text-[#E2C068]">
                <span className="w-6 h-px bg-[#D4AF37]" />
                <span>{t.qrEye}</span>
              </div>
              <div className="grid gap-3.5 grid-cols-2 max-w-[360px]">
                <a
                  href="weixin://dl/chat?HZM81MS"
                  target="_blank"
                  rel="noreferrer"
                  className="grid gap-2 justify-items-center p-3.5 bg-white border border-[#D4AF37] no-underline hover:border-white transition-colors"
                >
                  <Image
                    src="/assets/qr-wechat.png"
                    alt="Mã QR WeChat của Gao Ji House"
                    width={120}
                    height={120}
                    className="w-full max-w-[110px] aspect-square object-contain block"
                  />
                  <div className="grid gap-0.5 text-center">
                    <span className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-[#1F3A2E]">WeChat</span>
                    <span className="font-sans text-xs text-[#6B6255]">HZM81MS</span>
                  </div>
                </a>

                <a
                  href="https://t.me/HZM81MS"
                  target="_blank"
                  rel="noreferrer"
                  className="grid gap-2 justify-items-center p-3.5 bg-white border border-[#D4AF37] no-underline hover:border-white transition-colors"
                >
                  <Image
                    src="/assets/qr-telegram.png"
                    alt="Mã QR Telegram của Gao Ji House"
                    width={120}
                    height={120}
                    className="w-full max-w-[110px] aspect-square object-contain block"
                  />
                  <div className="grid gap-0.5 text-center">
                    <span className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-[#1F3A2E]">Telegram</span>
                    <span className="font-sans text-xs text-[#6B6255]">@HZM81MS</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="border border-[rgba(212,175,55,0.35)] grid">
            <div className="p-4 sm:p-5 border-b border-[rgba(212,175,55,0.35)] flex justify-between gap-4 items-baseline">
              <span className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-[#E2C068]">Zalo · WeChat</span>
              <span className="font-display text-xl text-white">088 923 7833</span>
            </div>
            <div className="p-4 sm:p-5 border-b border-[rgba(212,175,55,0.35)] flex justify-between gap-4 items-baseline">
              <span className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-[#E2C068]">Telegram · WeChat</span>
              <span className="font-display text-xl text-white">@HZM81MS</span>
            </div>
            <div className="p-4 sm:p-5 border-b border-[rgba(212,175,55,0.35)] flex justify-between gap-4 items-baseline">
              <span className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-[#E2C068]">Email</span>
              <span className="font-display text-xl text-white">stay@gaojihouse.vn</span>
            </div>
            <div className="p-4 sm:p-5 border-b border-[rgba(212,175,55,0.35)] flex justify-between gap-4 items-baseline">
              <span className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-[#E2C068]">{t.rowHours}</span>
              <span className="font-display text-xl text-white">{t.hoursVal}</span>
            </div>
            <div className="p-4 sm:p-5 flex justify-between gap-4 items-baseline">
              <span className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-[#E2C068]">{t.rowLang}</span>
              <span className="font-display text-xl text-white">Tiếng Việt · English · 中文</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Fixed Contact Rail ── */}
      <ContactRail
        zalo="https://zalo.me/0889237833"
        wechat="HZM81MS"
        phone="0889237833"
        telegram="https://t.me/HZM81MS"
        email="stay@gaojihouse.vn"
      />

      {/* ── Global Inquiry Modal ── */}
      <InquiryModal
        open={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        initialUnit={preselectedUnit}
        unitTypes={["1 Phòng Ngủ", "2 Phòng Ngủ", "Penthouse Duplex", "Chưa Xác Định"]}
      />
    </main>
  );
}
