"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useLanguage, type LanguageCode } from "@/context/LanguageContext";
import {
  Badge,
  Button,
  ContactRail,
  Icon,
  InquiryModal,
  MosaicGallery,
  PropertyLocationMap,
  PropertyDetailSkeleton,
  RoomSpecs,
  Tag,
} from "@/components/gaoji";
import {
  FALLBACK_GAOJI_UNITS,
  assetUrl,
  fetchPropertyDetail,
  type PropertyDetail,
} from "@/lib/api";
import { formatVnd } from "@/lib/format";

const DETAIL_LABELS: Record<LanguageCode, {
  loading: string; eyebrow: string; unit: string; tower: string; floor: string;
  available: string; priceTitle: string; priceRange: string; contactPrice: string;
  priceNote: string; zalo: string; quote: string; hotline: string; reply: string;
}> = {
  vi: { loading: "Đang tải thông tin chi tiết căn hộ...", eyebrow: "Căn Hộ Dịch Vụ Cao Cấp", unit: "Căn", tower: "Toà", floor: "Tầng", available: "Sẵn Sàng Cho Thuê", priceTitle: "Bảng Giá Thuê Trực Tiếp Từ Chủ Nhà", priceRange: "Khoảng Giá Tham Khảo", contactPrice: "Liên hệ để nhận báo giá", priceNote: "Giá chính xác phụ thuộc thời hạn thuê và tình trạng căn hộ tại thời điểm tư vấn.", zalo: "Chat Zalo Giữ Phòng Ngay", quote: "Gửi Yêu Cầu Báo Giá Trực Tiếp", hotline: "Hotline", reply: "Phản hồi trong 15 phút" },
  en: { loading: "Loading apartment details...", eyebrow: "Premium Serviced Apartment", unit: "Unit", tower: "Tower", floor: "Floor", available: "Available For Rent", priceTitle: "Direct Rates From The Host", priceRange: "Reference Price Range", contactPrice: "Contact us for a quote", priceNote: "The final rate depends on the lease term and availability at the time of enquiry.", zalo: "Chat On Zalo To Reserve", quote: "Request A Direct Quote", hotline: "Hotline", reply: "Response within 15 minutes" },
  cn: { loading: "正在加载公寓详情...", eyebrow: "高端服务式公寓", unit: "房号", tower: "楼栋", floor: "楼层", available: "可出租", priceTitle: "房东直租价格", priceRange: "参考价格范围", contactPrice: "联系我们获取报价", priceNote: "最终价格取决于租期及咨询时的房源状态。", zalo: "通过 Zalo 咨询预订", quote: "获取直接报价", hotline: "热线", reply: "15 分钟内回复" },
  tw: { loading: "正在載入公寓詳情...", eyebrow: "高端服務式公寓", unit: "房號", tower: "大樓", floor: "樓層", available: "可出租", priceTitle: "房東直租價格", priceRange: "參考價格範圍", contactPrice: "聯絡我們取得報價", priceNote: "最終價格取決於租期及諮詢時的房源狀態。", zalo: "透過 Zalo 諮詢預訂", quote: "取得直接報價", hotline: "熱線", reply: "15 分鐘內回覆" },
};

const VIEW_LABELS: Record<string, Record<Exclude<LanguageCode, "vi">, string>> = {
  "Trực diện Công viên 14ha & Cầu Sài Gòn": { en: "Direct View of the 14-hectare Park & Saigon Bridge", cn: "正对14公顷公园与西贡桥", tw: "正對14公頃公園與西貢橋" },
  "Trực diện Sông Sài Gòn & Bến Thuyền": { en: "Direct Saigon River & Marina View", cn: "正对西贡河与游艇码头", tw: "正對西貢河與遊艇碼頭" },
  "Landmark 81 & Sông Sài Gòn": { en: "Landmark 81 & Saigon River View", cn: "Landmark 81 与西贡河景观", tw: "Landmark 81 與西貢河景觀" },
  "Trực diện Sảnh & Quảng Trường Landmark 81": { en: "Direct Landmark 81 Lobby & Plaza View", cn: "正对 Landmark 81 大堂与广场", tw: "正對 Landmark 81 大堂與廣場" },
  "Panorama 360° Toàn Cảnh Sông & Thành Phố": { en: "360° Panoramic River & City View", cn: "360° 河景与城市全景", tw: "360° 河景與城市全景" },
};

const SECTION_LABELS: Record<LanguageCode, {
  overview: string; layout: string; amenities: string; apartmentAmenities: string;
  kitchenBath: string; rules: string; amenityItems: string[];
  ruleItems: { title: string; body: string }[];
}> = {
  vi: {
    overview: "Tổng Quan Không Gian & Thiết Kế", layout: "Bố Trí Từng Phòng Trong Căn Hộ",
    amenities: "Tiện Nghi & Trang Thiết Bị Đi Kèm", apartmentAmenities: "Tiện Nghi Căn Hộ",
    kitchenBath: "Bếp & Phòng Tắm", rules: "Nội Quy Cư Trú & Chính Sách",
    amenityItems: ["Wifi Cáp Quang 300Mbps", "Smart TV Truyền Hình K+", "Điều Hoà Trung Tâm", "Máy Giặt & Máy Sấy Riêng", "Bếp Từ & Lò Vi Sóng", "Ấm Siêu Tốc & Bộ Tách Trà", "Bồn Tắm Nằm & Máy Sấy Tóc", "Bộ Dầu Gội & Sữa Tắm Hữu Cơ"],
    ruleItems: [
      { title: "Nhận & Trả Phòng", body: "Nhận phòng từ 14:00 · Trả phòng trước 12:00 trưa (Hỗ trợ linh hoạt nếu phòng trống)." },
      { title: "Đăng Ký Khách Cư Trú", body: "Cung cấp CCCD / Hộ chiếu trước khi check-in để làm thủ tục khai báo tạm trú C06." },
      { title: "Không Hút Thuốc", body: "Nghiêm cấm hút thuốc trong căn hộ (Có thể sử dụng ban công mở)." },
      { title: "Vệ Sinh Định Kỳ", body: "Dọn phòng và thay ga gối định kỳ 2 lần/tuần cho khách thuê dài hạn." },
    ],
  },
  en: {
    overview: "Space & Design Overview", layout: "Apartment Room Layout",
    amenities: "Amenities & Included Equipment", apartmentAmenities: "Apartment Amenities",
    kitchenBath: "Kitchen & Bathroom", rules: "House Rules & Policies",
    amenityItems: ["300Mbps Fibre Wi-Fi", "Smart TV With K+", "Central Air Conditioning", "Private Washer & Dryer", "Induction Hob & Microwave", "Electric Kettle & Tea Set", "Bathtub & Hair Dryer", "Organic Shampoo & Body Wash"],
    ruleItems: [
      { title: "Check-in & Check-out", body: "Check in from 14:00 · Check out before 12:00 noon (Flexible when the apartment is available)." },
      { title: "Guest Registration", body: "Provide an ID card or passport before check-in for the required temporary-residence registration." },
      { title: "No Smoking", body: "Smoking is prohibited inside the apartment (the open balcony may be used)." },
      { title: "Scheduled Housekeeping", body: "Cleaning and linen replacement twice a week for long-term tenants." },
    ],
  },
  cn: {
    overview: "空间与设计概览", layout: "公寓房间布局", amenities: "配套设施与设备",
    apartmentAmenities: "公寓设施", kitchenBath: "厨房与浴室", rules: "入住须知与政策",
    amenityItems: ["300Mbps 光纤 Wi-Fi", "K+ 智能电视", "中央空调", "独立洗衣机与烘干机", "电磁炉与微波炉", "电热水壶与茶具", "浴缸与吹风机", "有机洗发水与沐浴露"],
    ruleItems: [
      { title: "入住与退房", body: "14:00 起入住 · 中午 12:00 前退房（房源空闲时可灵活安排）。" },
      { title: "住客登记", body: "入住前请提供身份证或护照，以办理临时住宿登记。" },
      { title: "禁止吸烟", body: "公寓内严禁吸烟（可使用开放式阳台）。" },
      { title: "定期保洁", body: "长租住客每周享受两次清洁与床品更换服务。" },
    ],
  },
  tw: {
    overview: "空間與設計概覽", layout: "公寓房間配置", amenities: "配套設施與設備",
    apartmentAmenities: "公寓設施", kitchenBath: "廚房與浴室", rules: "入住須知與政策",
    amenityItems: ["300Mbps 光纖 Wi-Fi", "K+ 智慧電視", "中央空調", "獨立洗衣機與乾衣機", "電磁爐與微波爐", "電熱水壺與茶具", "浴缸與吹風機", "有機洗髮精與沐浴乳"],
    ruleItems: [
      { title: "入住與退房", body: "14:00 起入住 · 中午 12:00 前退房（房源空閒時可彈性安排）。" },
      { title: "房客登記", body: "入住前請提供身分證或護照，以辦理臨時住宿登記。" },
      { title: "禁止吸煙", body: "公寓內嚴禁吸煙（可使用開放式陽台）。" },
      { title: "定期清潔", body: "長租房客每週享有兩次清潔與寢具更換服務。" },
    ],
  },
};

const CONTENT_TRANSLATIONS: Record<Exclude<LanguageCode, "vi">, Record<string, string>> = {
  en: {
    "Căn hộ 1 phòng ngủ cao cấp ngay trong tòa tháp biểu tượng Landmark 81. Bước chân xuống sảnh là trung tâm thương mại Vincom Center, rạp chiếu phim, sân băng và chuỗi nhà hàng 5 sao.": "A premium one-bedroom apartment inside the iconic Landmark 81 tower. Vincom Center, a cinema, ice rink and a collection of five-star restaurants are just downstairs.",
    "Phòng Khách Liền Bếp": "Open-plan Living Room & Kitchen", "Sofa Bed êm ái": "Comfortable sofa bed", "Smart TV 55-inch, Bếp từ, Tủ lạnh side-by-side": "55-inch Smart TV, induction hob and side-by-side refrigerator",
    "Phòng Ngủ Master": "Master Bedroom", "1 Giường King (1.8m x 2m)": "1 King bed (1.8m × 2m)", "View kính tràn sàn trực diện trung tâm thương mại & Vincom": "Floor-to-ceiling windows overlooking the shopping centre and Vincom",
  },
  cn: {
    "Căn hộ 1 phòng ngủ cao cấp ngay trong tòa tháp biểu tượng Landmark 81. Bước chân xuống sảnh là trung tâm thương mại Vincom Center, rạp chiếu phim, sân băng và chuỗi nhà hàng 5 sao.": "位于地标性 Landmark 81 大厦内的高端一居室公寓。下楼即可到达 Vincom Center、电影院、溜冰场及多家五星级餐厅。",
    "Phòng Khách Liền Bếp": "开放式客厅与厨房", "Sofa Bed êm ái": "舒适沙发床", "Smart TV 55-inch, Bếp từ, Tủ lạnh side-by-side": "55 英寸智能电视、电磁炉与双开门冰箱",
    "Phòng Ngủ Master": "主卧", "1 Giường King (1.8m x 2m)": "1 张特大床（1.8m × 2m）", "View kính tràn sàn trực diện trung tâm thương mại & Vincom": "落地窗正对购物中心与 Vincom",
  },
  tw: {
    "Căn hộ 1 phòng ngủ cao cấp ngay trong tòa tháp biểu tượng Landmark 81. Bước chân xuống sảnh là trung tâm thương mại Vincom Center, rạp chiếu phim, sân băng và chuỗi nhà hàng 5 sao.": "位於地標性 Landmark 81 大樓內的高端一房公寓。下樓即可抵達 Vincom Center、電影院、溜冰場及多家五星級餐廳。",
    "Phòng Khách Liền Bếp": "開放式客廳與廚房", "Sofa Bed êm ái": "舒適沙發床", "Smart TV 55-inch, Bếp từ, Tủ lạnh side-by-side": "55 吋智慧電視、電磁爐與對開門冰箱",
    "Phòng Ngủ Master": "主臥", "1 Giường King (1.8m x 2m)": "1 張特大床（1.8m × 2m）", "View kính tràn sàn trực diện trung tâm thương mại & Vincom": "落地窗正對購物中心與 Vincom",
  },
};

export default function PropertyDetailPage() {
  const { lang } = useLanguage();
  const labels = DETAIL_LABELS[lang];
  const sections = SECTION_LABELS[lang];
  const params = useParams();
  const idOrSlug = typeof params.id === "string" ? params.id : "";

  const [unit, setUnit] = useState<PropertyDetail | null>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  useEffect(() => {
    if (idOrSlug) {
      fetchPropertyDetail(idOrSlug)
        .then((data) => {
          setUnit(data);
        })
        .catch(() => {
          // Find fallback unit
          const fallback =
            FALLBACK_GAOJI_UNITS.find(
              (u) => u.id === idOrSlug || u.slug === idOrSlug || u.unit_code === idOrSlug
            ) || FALLBACK_GAOJI_UNITS[0];
          setUnit(fallback);
        });
    }
  }, [idOrSlug]);

  if (!unit) {
    return <PropertyDetailSkeleton label={labels.loading} />;
  }

  const monthlyPrice = unit.price_monthly ? Number(unit.price_monthly) : null;
  const nightlyPrice = unit.price_nightly ? Number(unit.price_nightly) : null;
  const availablePrices = [nightlyPrice, monthlyPrice].filter(
    (price): price is number => price !== null,
  );
  const priceRange = availablePrices.length > 0
    ? `${formatVnd(Math.min(...availablePrices))} – ${formatVnd(Math.max(...availablePrices))}`
    : labels.contactPrice;
  const localizedName = lang === "vi"
    ? unit.name
    : unit.name.replace(/\bCăn\b/gi, labels.unit);
  const localizedView = unit.view_type && lang !== "vi"
    ? VIEW_LABELS[unit.view_type]?.[lang] || unit.view_type
    : unit.view_type;
  const localizeContent = (value: string) =>
    lang === "vi" ? value : CONTENT_TRANSLATIONS[lang][value] || value;
  const layoutItems = Array.isArray(unit.room_layout) ? unit.room_layout : [];

  const galleryFallbacks = [
    {
      id: `${unit.id}-living-room`,
      src: unit.cover_image || "/assets/photos/living-open-plan.jpg",
      alt: `Phòng khách ngập ánh sáng của ${unit.name}`,
      width: 1600,
      height: 1067,
      category: "living-room" as const,
      caption: "Không gian sinh hoạt chung của căn hộ",
    },
    { id: `${unit.id}-kitchen`, src: "/assets/photos/kitchen-island.jpg", alt: "Khu bếp đảo hiện đại", width: 1600, height: 1067, category: "kitchen" as const },
    { id: `${unit.id}-bedroom`, src: "/assets/photos/master-bedroom.jpg", alt: "Phòng ngủ chính với giường lớn", width: 1600, height: 1067, category: "bedroom" as const },
    { id: `${unit.id}-bathroom`, src: "/assets/photos/bathroom-vanity.jpg", alt: "Phòng tắm của căn hộ", width: 1067, height: 1600, category: "bathroom" as const },
    { id: `${unit.id}-balcony`, src: "/assets/photos/landmark-81-balcony.jpg", alt: "Không gian ban công", width: 1600, height: 900, category: "balcony" as const },
  ];
  // API hiện chưa trả kích thước/category; giữ ảnh ở nhóm "Khác" thay vì suy đoán từ tên file.
  const galleryImages = unit.images.length > 0
    ? unit.images.map((image) => ({
        id: image.id,
        src: assetUrl(image.url),
        alt: image.alt || unit.name,
        width: 1600,
        height: 1200,
      }))
    : galleryFallbacks;

  return (
    <div className="gh-content-enter bg-[var(--canvas,#F9F7F2)] min-h-screen text-[var(--text-primary,#1A1A1A)] pb-24">
      {/* ── 1. HEADER DETAILS & SPECS ───────────────────────── */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-8 sm:pt-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-8 h-px bg-[var(--gold-700)]" />
          <span className="font-sans text-[var(--fs-label,0.75rem)] font-semibold uppercase tracking-[var(--tracking-caps,0.15em)] text-[var(--gold-900)]">
            {labels.eyebrow} · Vinhomes Central Park
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6">
          <div>
            <h1 className="font-display text-3xl sm:text-5xl font-normal leading-[1.05] tracking-[-0.02em] text-[var(--ink-900)] uppercase">
              {localizedName}
            </h1>
            <p className="font-sans text-base sm:text-lg italic text-[var(--text-muted)] mt-2">
              {unit.tower ? `${labels.tower} ${unit.tower}` : "Vinhomes Central Park"}
              {unit.floor ? ` · ${labels.floor} ${unit.floor}` : ""}
              {localizedView ? ` · ${localizedView}` : ""}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="available" icon="badge-check">
              {labels.available}
            </Badge>
            <Badge tone="gold" icon="map-pin">
              0.2 km · Landmark 81
            </Badge>
          </div>
        </div>

        <hr className="h-px border-0 bg-[var(--hairline)] my-2" />

        <div className="py-4">
          <RoomSpecs
            beds={unit.bedrooms || 2}
            baths={unit.bathrooms || 2}
            sqm={unit.sqm || 82}
            guests={unit.max_guests || 4}
          />
        </div>
      </section>

      {/* ── 2. GALLERY SHOWCASE GRID ────────────────────────── */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 mt-6">
        <MosaicGallery images={galleryImages} propertyName={unit.name} />
      </section>

      {/* ── 3. TWO-COLUMN SPLIT: DETAILS & STICKY BOOKING CARD ─ */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Details, Layout, Amenities, Rules */}
        <div className="lg:col-span-7 flex flex-col gap-12">
          {/* Overview */}
          <div className="bg-[var(--surface-raised)] p-6 sm:p-8 border border-[var(--hairline)]">
            <h2 className="font-display text-2xl font-normal text-[var(--ink-900)] uppercase mb-4">
              {sections.overview}
            </h2>
            <p className="font-sans text-base leading-relaxed text-[var(--text-body)]">
              {localizeContent(unit.description ||
                "Không gian căn hộ dịch vụ cao cấp được hoàn thiện với tiêu chuẩn khắt khe. Toàn bộ sàn gỗ tự nhiên kết hợp đá marble, hệ thống kính Low-E 3 lớp chống ồn tuyệt đối mang lại giấc ngủ trọn vẹn và không gian làm việc tĩnh lặng cho quý khách.")}
            </p>
          </div>

          {/* Room Layout Breakdown */}
          <div className="bg-[var(--surface-raised)] p-6 sm:p-8 border border-[var(--hairline)]">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-6 h-px bg-[var(--gold-700)]" />
              <h2 className="font-display text-2xl font-normal text-[var(--ink-900)] uppercase">
                {sections.layout}
              </h2>
            </div>

            <div className="divide-y divide-[var(--hairline)]">
              {layoutItems.length > 0 ? (
                layoutItems.map((item, i) => (
                  <div key={i} className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="sm:w-1/3">
                      <span className="font-sans text-sm font-semibold uppercase tracking-wider text-[var(--jade-900)]">
                        {localizeContent(item.room)}
                      </span>
                      <span className="block font-sans text-xs text-[var(--gold-900)] mt-0.5">
                        {localizeContent(item.bed)}
                      </span>
                    </div>
                    <div className="sm:w-2/3 font-sans text-sm text-[var(--text-body)]">
                      {localizeContent(item.specs)}
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="sm:w-1/3">
                      <span className="font-sans text-sm font-semibold uppercase tracking-wider text-[var(--jade-900)]">
                        Phòng Khách & Bếp
                      </span>
                      <span className="block font-sans text-xs text-[var(--gold-900)] mt-0.5">
                        Sofa Lớn & Bàn Ăn
                      </span>
                    </div>
                    <div className="sm:w-2/3 font-sans text-sm text-[var(--text-body)]">
                      Smart TV 65-inch 4K, bếp từ âm Bosch, tủ lạnh lớn, bàn ăn 4 ghế gỗ óc chó.
                    </div>
                  </div>
                  <div className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="sm:w-1/3">
                      <span className="font-sans text-sm font-semibold uppercase tracking-wider text-[var(--jade-900)]">
                        Phòng Ngủ Master
                      </span>
                      <span className="block font-sans text-xs text-[var(--gold-900)] mt-0.5">
                        1 Giường King (1.8m x 2m)
                      </span>
                    </div>
                    <div className="sm:w-2/3 font-sans text-sm text-[var(--text-body)]">
                      Cửa sổ kính panorama view Landmark 81, nệm lò xo túi êm ái, bàn làm việc và WC riêng.
                    </div>
                  </div>
                  <div className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="sm:w-1/3">
                      <span className="font-sans text-sm font-semibold uppercase tracking-wider text-[var(--jade-900)]">
                        Ban Công Thoáng Mát
                      </span>
                      <span className="block font-sans text-xs text-[var(--gold-900)] mt-0.5">
                        Bàn Trà Ngắm Cảnh
                      </span>
                    </div>
                    <div className="sm:w-2/3 font-sans text-sm text-[var(--text-body)]">
                      Tầm nhìn bao trọn công viên ven sông 14ha và ánh đèn lung linh của thành phố.
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Grouped Amenities */}
          <div className="bg-[var(--surface-raised)] p-6 sm:p-8 border border-[var(--hairline)]">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-6 h-px bg-[var(--gold-700)]" />
              <h2 className="font-display text-2xl font-normal text-[var(--ink-900)] uppercase">
                {sections.amenities}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[var(--gold-900)]">
                  {sections.apartmentAmenities}
                </span>
                <div className="flex flex-wrap gap-2">
                  <Tag icon="wifi">{sections.amenityItems[0]}</Tag>
                  <Tag icon="tv">{sections.amenityItems[1]}</Tag>
                  <Tag icon="air-vent">{sections.amenityItems[2]}</Tag>
                  <Tag icon="sparkles">{sections.amenityItems[3]}</Tag>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[var(--gold-900)]">
                  {sections.kitchenBath}
                </span>
                <div className="flex flex-wrap gap-2">
                  <Tag icon="cooking-pot">{sections.amenityItems[4]}</Tag>
                  <Tag icon="coffee">{sections.amenityItems[5]}</Tag>
                  <Tag icon="bath">{sections.amenityItems[6]}</Tag>
                  <Tag icon="sparkles">{sections.amenityItems[7]}</Tag>
                </div>
              </div>
            </div>
          </div>

          {/* House Rules & Policies */}
          <div className="bg-[var(--surface-raised)] p-6 sm:p-8 border border-[var(--hairline)]">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-px bg-[var(--gold-700)]" />
              <h2 className="font-display text-2xl font-normal text-[var(--ink-900)] uppercase">
                {sections.rules}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-sm text-[var(--text-body)]">
              <div className="flex items-start gap-3">
                <Icon name="clock" size={16} color="var(--gold-900)" className="mt-1 shrink-0" />
                <div>
                  <strong>{sections.ruleItems[0].title}:</strong>
                  <br />
                  {sections.ruleItems[0].body}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Icon name="shield-check" size={16} color="var(--gold-900)" className="mt-1 shrink-0" />
                <div>
                  <strong>{sections.ruleItems[1].title}:</strong>
                  <br />
                  {sections.ruleItems[1].body}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Icon name="alert-triangle" size={16} color="var(--gold-900)" className="mt-1 shrink-0" />
                <div>
                  <strong>{sections.ruleItems[2].title}:</strong>
                  <br />
                  {sections.ruleItems[2].body}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Icon name="sparkles" size={16} color="var(--gold-900)" className="mt-1 shrink-0" />
                <div>
                  <strong>{sections.ruleItems[3].title}:</strong>
                  <br />
                  {sections.ruleItems[3].body}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Price & Contact Card */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="bg-[var(--canvas-warm)] border border-[var(--gold-700)] p-6 sm:p-8">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold-900)]">
              {labels.priceTitle}
            </span>

            {/* Compact price range */}
            <div className="mt-4 pb-6 border-b border-[var(--hairline)]">
              <span className="font-sans text-xs uppercase tracking-wider text-[var(--text-muted)] block">
                {labels.priceRange}
              </span>
              <strong className="mt-1 block font-display text-3xl font-medium text-[var(--jade-700)] sm:text-4xl">
                {priceRange}
              </strong>
              <p className="mt-2 font-sans text-xs leading-5 text-[var(--text-muted)]">
                {labels.priceNote}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-5">
              <div className="flex flex-col gap-2.5">
                <Button
                  variant="gold"
                  size="md"
                  full
                  icon="message-circle"
                  as="a"
                  href={`https://zalo.me/0889237833?text=Toi%20quan%20tam%20can%20ho%20${encodeURIComponent(
                    unit.unit_code || unit.name
                  )}`}
                  target="_blank"
                >
                  {labels.zalo}
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  full
                  onClick={() => setInquiryOpen(true)}
                >
                  {labels.quote}
                </Button>
              </div>

              {/* Direct host info */}
              <div className="mt-4 pt-4 border-t border-[var(--hairline)] flex items-center justify-between font-sans text-xs text-[var(--text-muted)]">
                <span className="flex items-center gap-1.5">
                  <Icon name="phone" size={13} color="var(--gold-900)" />
                  <span>{labels.hotline}: 088 923 7833</span>
                </span>
                <span>{labels.reply}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PropertyLocationMap
        propertyName={unit.name}
        tower={unit.tower}
        address={unit.address}
        city={unit.city}
      />

      <ContactRail onInquire={() => setInquiryOpen(true)} />

      <InquiryModal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        initialUnitCode={unit.unit_code || unit.name}
      />
    </div>
  );
}
