"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage, type LanguageCode } from "@/context/LanguageContext";
import { Button } from "./Button";
import { Icon } from "./Icon";

type Question = { question: string; answer: string };
type Fee = { item: string; amount: string };
type FaqCopy = {
  eyebrow: string;
  title: string;
  summary: string;
  open: string;
  close: string;
  dialogLabel: string;
  groups: Array<{ title: string; questions: Question[] }>;
  feeQuestion: string;
  feeAnswer: string;
  feeItem: string;
  feeAmount: string;
  fees: Fee[];
};

const FAQ_COPY: Record<LanguageCode, FaqCopy> = {
  vi: {
    eyebrow: "Câu hỏi thường gặp",
    title: "Nội quy căn hộ & biểu phí",
    summary: "Xem nhanh thông tin nhận phòng, quy định sinh hoạt và chi phí bồi thường trong thời gian lưu trú.",
    open: "Xem câu hỏi thường gặp",
    close: "Đóng",
    dialogLabel: "Câu hỏi thường gặp về nội quy căn hộ",
    groups: [
      {
        title: "1. Thủ tục Nhận và Trả phòng",
        questions: [
          { question: "Tôi cần chuẩn bị giấy tờ gì để nhận phòng?", answer: "Quý khách vui lòng xuất trình CCCD/CMND hoặc hộ chiếu hợp lệ để làm thủ tục nhận phòng." },
          { question: "Giờ nhận và trả phòng là mấy giờ?", answer: "Giờ nhận phòng là 14:00 và giờ trả phòng là 12:00 trưa. Nhận phòng sớm hoặc trả phòng trễ sẽ áp dụng phụ phí tương ứng." },
          { question: "Căn hộ có giới hạn số người lưu trú không?", answer: "Có. Số người ở không được vượt quá số lượng cho phép khi đăng ký thuê. Vi phạm sẽ bị phạt 1.000.000 VNĐ/người." },
          { question: "Nếu có người lưu trú chưa đăng ký thì sao?", answer: "Khách thuê phải cung cấp thông tin chính xác của toàn bộ người lưu trú. Nếu công an kiểm tra và phát hiện người chưa đăng ký, khách thuê chịu mức phạt 5.000.000 VNĐ/người." },
        ],
      },
      {
        title: "2. Nội quy Sinh hoạt",
        questions: [
          { question: "Khung giờ yên tĩnh là khi nào?", answer: "Giờ yên tĩnh từ 22:00 đến 07:00. Sau 22:00, vui lòng không tổ chức tiệc, hát karaoke hoặc mở nhạc lớn." },
          { question: "Tôi có được hút thuốc trong căn hộ không?", answer: "Căn hộ cấm hút thuốc. Nếu cần hút thuốc, vui lòng sử dụng ban công và không mở cửa ban công khi máy lạnh đang bật. Vi phạm bị phạt 1.000.000 VNĐ." },
          { question: "Sau khi sử dụng bếp, tôi cần làm gì?", answer: "Vui lòng dọn sạch khu vực bếp, rửa chén bát và vứt rác đúng nơi quy định. Không tuân thủ sẽ bị tính phí vệ sinh 200.000 VNĐ." },
          { question: "Tôi cần lưu ý gì tại khu vực công cộng và khi sử dụng khăn?", answer: "Không mặc đồ bơi, bikini hoặc cởi trần tại hành lang, sảnh; vui lòng giữ yên lặng tại khu vực công cộng. Khăn chỉ dùng khi tắm, không dùng lau balo, giày dép hoặc chân. Khăn vấy bẩn bị tính 200.000 VNĐ/khăn." },
          { question: "Những hành vi hoặc vật dụng nào bị cấm?", answer: "Nghiêm cấm ma túy, mại dâm, đánh bạc; không mang đạn dược, vũ khí, chất cháy nổ, chất độc hại, ma túy hoặc thú cưng vào căn hộ. GaoJi's House có quyền yêu cầu khách rời đi nếu vi phạm quy định này." },
        ],
      },
      {
        title: "3. Bồi thường và Vi phạm",
        questions: [
          { question: "Tôi có thể đưa thẻ từ cho người khác hoặc di chuyển đồ đạc không?", answer: "Vui lòng giữ thẻ từ cẩn thận, không đưa cho người khác và không tự ý di chuyển đồ đạc hoặc thiết bị. Hư hỏng phải bồi thường 100% chi phí; mất thẻ từ bồi thường 300.000 VNĐ." },
        ],
      },
    ],
    feeQuestion: "Biểu phí đền bù hư hỏng hoặc mất mát là bao nhiêu?",
    feeAnswer: "Mức bồi thường được áp dụng theo bảng dưới đây:",
    feeItem: "Thiết bị / Vật dụng",
    feeAmount: "Chi phí bồi thường",
    fees: [
      { item: "Thẻ từ thang máy", amount: "300.000 VNĐ/cái" }, { item: "Remote TV", amount: "200.000 VNĐ/cái" },
      { item: "Remote máy lạnh", amount: "200.000 VNĐ/cái" }, { item: "Khăn tắm", amount: "200.000 VNĐ/cái" },
      { item: "Ruột gối", amount: "400.000 VNĐ/cái" }, { item: "Vỏ gối", amount: "100.000 VNĐ/cái" },
      { item: "Chăn/Mền", amount: "700.000 VNĐ/cái" }, { item: "Ga trải giường", amount: "200.000 VNĐ/cái" },
      { item: "Ly thủy tinh/Cốc/Chén/Dĩa", amount: "50.000 VNĐ/cái" }, { item: "Bình đun siêu tốc", amount: "600.000 VNĐ/cái" },
      { item: "Máy sấy tóc", amount: "600.000 VNĐ/cái" }, { item: "Lò vi sóng", amount: "3.000.000 VNĐ/cái" },
    ],
  },
  en: {
    eyebrow: "Frequently asked questions", title: "House rules & charges",
    summary: "Review check-in details, house rules, and compensation charges for your stay.",
    open: "View frequently asked questions", close: "Close", dialogLabel: "House rules frequently asked questions",
    groups: [
      { title: "1. Check-in and Check-out", questions: [
        { question: "What identification do I need at check-in?", answer: "Please present a valid Citizen ID or passport when checking in." },
        { question: "What are the check-in and check-out times?", answer: "Check-in is at 2 PM and check-out is at 12 PM. Early check-in or late check-out incurs the corresponding surcharge." },
        { question: "Is there an occupancy limit?", answer: "Yes. The number of occupants must not exceed the permitted number registered for the apartment. A violation incurs a fine of VND 1,000,000 per person." },
        { question: "What happens if a guest has not been declared?", answer: "The tenant must provide accurate information for every occupant. If a police inspection finds an undeclared guest, the tenant is responsible for a fine of VND 5,000,000 per person." },
      ] },
      { title: "2. During Your Stay", questions: [
        { question: "When are quiet hours?", answer: "Quiet hours are from 10 PM to 7 AM. No parties, karaoke, or loud music are allowed after 10 PM." },
        { question: "May I smoke in the apartment?", answer: "The apartment is non-smoking. Please smoke only on the balcony and do not open the balcony door while the air conditioner is running. Non-compliance incurs a VND 1,000,000 fine." },
        { question: "What should I do after using the kitchen?", answer: "Please clean the kitchen, wash the dishes, and dispose of trash properly. Failure to do so incurs a VND 200,000 cleaning charge." },
        { question: "What should I know about public areas and towels?", answer: "Please do not wear swimwear, bikinis, or go shirtless in hallways or lobbies, and keep noise down in public areas. Towels are for showering only; a soiled towel incurs a VND 200,000 charge." },
        { question: "Which activities and items are prohibited?", answer: "Drug use, prostitution, and gambling are prohibited. Ammunition, weapons, explosives, toxic substances, narcotics, and pets are not allowed. GaoJi's House may require guests to leave for violating this rule." },
      ] },
      { title: "3. Compensation and Violations", questions: [
        { question: "May I share the access card or move furniture?", answer: "Please keep the access card safe, do not give it to others, and do not move furniture or equipment without permission. Damage is charged at 100% of its cost; a lost access card costs VND 300,000." },
      ] },
    ],
    feeQuestion: "What are the damage and loss charges?", feeAnswer: "The following compensation charges apply:",
    feeItem: "Equipment / Item", feeAmount: "Compensation charge",
    fees: [
      { item: "Elevator access card", amount: "VND 300,000/item" }, { item: "TV remote", amount: "VND 200,000/item" },
      { item: "Air conditioner remote", amount: "VND 200,000/item" }, { item: "Bath towel", amount: "VND 200,000/item" },
      { item: "Pillow", amount: "VND 400,000/item" }, { item: "Pillowcase", amount: "VND 100,000/item" },
      { item: "Blanket", amount: "VND 700,000/item" }, { item: "Bedsheet", amount: "VND 200,000/item" },
      { item: "Glass/cup/bowl/plate", amount: "VND 50,000/item" }, { item: "Kettle", amount: "VND 600,000/item" },
      { item: "Hair dryer", amount: "VND 600,000/item" }, { item: "Microwave", amount: "VND 3,000,000/item" },
    ],
  },
  cn: {
    eyebrow: "常见问题", title: "公寓规定与赔偿费用", summary: "快速查看入住手续、住宿规定及损坏或遗失物品的赔偿费用。",
    open: "查看常见问题", close: "关闭", dialogLabel: "公寓规定常见问题",
    groups: [
      { title: "1. 入住与退房手续", questions: [
        { question: "办理入住需要什么证件？", answer: "办理入住时，请出示有效身份证件或护照。" },
        { question: "入住和退房时间是几点？", answer: "入住时间为下午 2 点，退房时间为中午 12 点。提前入住或延迟退房需支付相应费用。" },
        { question: "公寓有入住人数限制吗？", answer: "有。实际入住人数不得超过登记租房时允许的人数，违者每人罚款 1,000,000 越南盾。" },
        { question: "如果有未登记住客会怎样？", answer: "租户须提供所有住客的准确信息。如警方检查发现未登记住客，租户须承担每人 5,000,000 越南盾的罚款。" },
      ] },
      { title: "2. 住宿期间规定", questions: [
        { question: "安静时间是什么时候？", answer: "安静时间为晚上 10 点至早上 7 点。晚上 10 点后禁止聚会、卡拉 OK 或播放大声音乐。" },
        { question: "可以在公寓内吸烟吗？", answer: "公寓内禁止吸烟。如需吸烟，请前往阳台；空调运行时请勿打开阳台门。违规罚款 1,000,000 越南盾。" },
        { question: "使用厨房后需要做什么？", answer: "请清理厨房、清洗餐具并妥善处理垃圾，否则将收取 200,000 越南盾清洁费。" },
        { question: "公共区域和毛巾使用有哪些注意事项？", answer: "请勿在走廊或大厅穿泳装、比基尼或赤膊，并请保持安静。毛巾仅供淋浴使用；毛巾弄脏将收取每条 200,000 越南盾。" },
        { question: "哪些行为和物品被禁止？", answer: "严禁吸毒、卖淫和赌博。禁止携带弹药、武器、爆炸物、有毒物质、毒品或宠物。违反规定时，GaoJi's House 有权要求住客离开。" },
      ] },
      { title: "3. 赔偿与违规", questions: [
        { question: "可以将门禁卡交给他人或移动家具吗？", answer: "请妥善保管门禁卡，勿转交他人；未经许可请勿移动家具或设备。损坏须承担全部赔偿，遗失门禁卡赔偿 300,000 越南盾。" },
      ] },
    ],
    feeQuestion: "物品损坏或遗失如何赔偿？", feeAnswer: "赔偿标准如下：", feeItem: "设备 / 物品", feeAmount: "赔偿费用",
    fees: [
      { item: "电梯门禁卡", amount: "300,000 越南盾/件" }, { item: "电视遥控器", amount: "200,000 越南盾/件" },
      { item: "空调遥控器", amount: "200,000 越南盾/件" }, { item: "浴巾", amount: "200,000 越南盾/件" },
      { item: "枕头", amount: "400,000 越南盾/件" }, { item: "枕套", amount: "100,000 越南盾/件" },
      { item: "毯子", amount: "700,000 越南盾/件" }, { item: "床单", amount: "200,000 越南盾/件" },
      { item: "玻璃杯/杯子/碗/盘子", amount: "50,000 越南盾/件" }, { item: "电水壶", amount: "600,000 越南盾/件" },
      { item: "电吹风", amount: "600,000 越南盾/件" }, { item: "微波炉", amount: "3,000,000 越南盾/件" },
    ],
  },
  tw: {
    eyebrow: "常見問題", title: "公寓規定與賠償費用", summary: "快速查看入住手續、住宿規定及損壞或遺失物品的賠償費用。",
    open: "查看常見問題", close: "關閉", dialogLabel: "公寓規定常見問題",
    groups: [
      { title: "1. 入住與退房手續", questions: [
        { question: "辦理入住需要什麼證件？", answer: "辦理入住時，請出示有效身分證件或護照。" },
        { question: "入住和退房時間是幾點？", answer: "入住時間為下午 2 點，退房時間為中午 12 點。提前入住或延遲退房需支付相應費用。" },
        { question: "公寓有入住人數限制嗎？", answer: "有。實際入住人數不得超過登記租房時允許的人數，違者每人罰款 1,000,000 越南盾。" },
        { question: "如果有未登記住客會怎樣？", answer: "租戶須提供所有住客的準確資訊。如警方檢查發現未登記住客，租戶須承擔每人 5,000,000 越南盾的罰款。" },
      ] },
      { title: "2. 住宿期間規定", questions: [
        { question: "安靜時間是什麼時候？", answer: "安靜時間為晚上 10 點至早上 7 點。晚上 10 點後禁止聚會、卡拉 OK 或播放大聲音樂。" },
        { question: "可以在公寓內吸煙嗎？", answer: "公寓內禁止吸煙。如需吸煙，請前往陽台；空調運行時請勿打開陽台門。違規罰款 1,000,000 越南盾。" },
        { question: "使用廚房後需要做什麼？", answer: "請清理廚房、清洗餐具並妥善處理垃圾，否則將收取 200,000 越南盾清潔費。" },
        { question: "公共區域和毛巾使用有哪些注意事項？", answer: "請勿在走廊或大廳穿泳裝、比基尼或赤膊，並請保持安靜。毛巾僅供淋浴使用；毛巾弄髒將收取每條 200,000 越南盾。" },
        { question: "哪些行為和物品被禁止？", answer: "嚴禁吸毒、賣淫和賭博。禁止攜帶彈藥、武器、爆炸物、有毒物質、毒品或寵物。違反規定時，GaoJi's House 有權要求住客離開。" },
      ] },
      { title: "3. 賠償與違規", questions: [
        { question: "可以將門禁卡交給他人或移動傢俱嗎？", answer: "請妥善保管門禁卡，勿轉交他人；未經許可請勿移動傢俱或設備。損壞須承擔全部賠償，遺失門禁卡賠償 300,000 越南盾。" },
      ] },
    ],
    feeQuestion: "物品損壞或遺失如何賠償？", feeAnswer: "賠償標準如下：", feeItem: "設備 / 物品", feeAmount: "賠償費用",
    fees: [
      { item: "電梯門禁卡", amount: "300,000 越南盾/件" }, { item: "電視遙控器", amount: "200,000 越南盾/件" },
      { item: "空調遙控器", amount: "200,000 越南盾/件" }, { item: "浴巾", amount: "200,000 越南盾/件" },
      { item: "枕頭", amount: "400,000 越南盾/件" }, { item: "枕套", amount: "100,000 越南盾/件" },
      { item: "毯子", amount: "700,000 越南盾/件" }, { item: "床單", amount: "200,000 越南盾/件" },
      { item: "玻璃杯/杯子/碗/盤子", amount: "50,000 越南盾/件" }, { item: "電水壺", amount: "600,000 越南盾/件" },
      { item: "吹風機", amount: "600,000 越南盾/件" }, { item: "微波爐", amount: "3,000,000 越南盾/件" },
    ],
  },
};

export function HouseRulesFaq() {
  const { lang } = useLanguage();
  const copy = FAQ_COPY[lang];
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const openFromHeader = () => setOpen(true);
    const openFromHash = () => {
      if (window.location.hash === "#faq") setOpen(true);
    };
    window.addEventListener("gaoji:open-faq", openFromHeader);
    window.addEventListener("hashchange", openFromHash);
    openFromHash();
    return () => {
      window.removeEventListener("gaoji:open-faq", openFromHeader);
      window.removeEventListener("hashchange", openFromHash);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], summary, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
      trigger?.focus();
    };
  }, [open]);

  return (
    <section id="faq" className="scroll-mt-20 border-y border-[#E8E4DB] bg-[#FAF8F5] px-[clamp(20px,4vw,56px)] py-[clamp(48px,5vw,80px)]">
      <div className="mx-auto grid max-w-[900px] justify-items-center gap-5 text-center">
        <span className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-[#8A6214]">{copy.eyebrow}</span>
        <h2 className="max-w-[24ch] font-display text-[clamp(1.75rem,2vw+1rem,2.5rem)] font-medium text-[#0D3B22]">{copy.title}</h2>
        <p className="max-w-[62ch] font-sans text-base leading-relaxed text-[#514A42]">{copy.summary}</p>
        <button ref={triggerRef} type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open} className="inline-flex min-h-[46px] cursor-pointer items-center justify-center gap-2.5 border border-[var(--jade-700)] bg-[var(--jade-700)] px-4 font-sans text-[0.8125rem] font-semibold uppercase tracking-[0.15em] text-[var(--paper-150)] transition-colors hover:bg-[var(--jade-900)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-500)]">
          <Icon name="book-open" size={16} /> <span>{copy.open}</span>
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[500] grid place-items-center bg-black/65 p-3 backdrop-blur-sm sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={copy.dialogLabel} className="flex max-h-[92dvh] w-full max-w-[920px] flex-col border border-[#D4AF37] bg-[#FBF9F5] shadow-2xl">
            <header className="flex shrink-0 items-start justify-between gap-5 border-b border-[#DDD5C7] bg-[#1F3A2E] px-5 py-4 text-white sm:px-7">
              <div className="grid gap-1">
                <span className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#E2C068]">GaoJi&apos;s House</span>
                <h2 className="font-display text-xl font-semibold sm:text-2xl">{copy.title}</h2>
              </div>
              <button ref={closeButtonRef} type="button" onClick={() => setOpen(false)} aria-label={copy.close} className="grid size-11 shrink-0 cursor-pointer place-items-center border border-white/35 text-white transition-colors hover:border-[#E2C068] hover:text-[#E2C068] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2C068]">
                <Icon name="x" size={21} />
              </button>
            </header>

            <div className="overflow-y-auto overscroll-contain px-4 py-5 sm:px-7 sm:py-7">
              <div className="grid gap-8">
                {copy.groups.map((group, groupIndex) => (
                  <section key={group.title} aria-labelledby={`faq-group-${groupIndex}`} className="grid gap-3">
                    <h3 id={`faq-group-${groupIndex}`} className="border-b border-[#D4AF37] pb-2 font-display text-lg font-bold text-[#0D3B22] sm:text-xl">{group.title}</h3>
                    <div className="grid gap-2">
                      {group.questions.map((item) => (
                        <details key={item.question} className="group border border-[#DDD5C7] bg-white open:border-[#B08D57]">
                          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 font-sans text-sm font-bold text-[#1A1A1A] marker:hidden sm:text-base">
                            <span>{item.question}</span><Icon name="chevron-down" size={18} className="shrink-0 transition-transform group-open:rotate-180" />
                          </summary>
                          <p className="border-t border-[#E8E4DB] px-4 py-3 font-sans text-sm leading-relaxed text-[#514A42] sm:text-base">{item.answer}</p>
                        </details>
                      ))}
                    </div>

                    {groupIndex === 2 && (
                      <details className="group border border-[#B08D57] bg-white">
                        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 font-sans text-sm font-bold text-[#1A1A1A] marker:hidden sm:text-base">
                          <span>{copy.feeQuestion}</span><Icon name="chevron-down" size={18} className="shrink-0 transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="border-t border-[#E8E4DB] p-4">
                          <p className="mb-3 font-sans text-sm text-[#514A42] sm:text-base">{copy.feeAnswer}</p>
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[520px] border-collapse font-sans text-left text-sm">
                              <thead><tr className="bg-[#1F3A2E] text-white"><th className="w-14 border border-[#486154] px-3 py-2">#</th><th className="border border-[#486154] px-3 py-2">{copy.feeItem}</th><th className="border border-[#486154] px-3 py-2">{copy.feeAmount}</th></tr></thead>
                              <tbody>{copy.fees.map((fee, index) => <tr key={fee.item} className="odd:bg-[#FAF8F5]"><td className="border border-[#DDD5C7] px-3 py-2">{index + 1}</td><td className="border border-[#DDD5C7] px-3 py-2">{fee.item}</td><td className="whitespace-nowrap border border-[#DDD5C7] px-3 py-2 font-semibold">{fee.amount}</td></tr>)}</tbody>
                            </table>
                          </div>
                        </div>
                      </details>
                    )}
                  </section>
                ))}
              </div>
            </div>

            <footer className="flex shrink-0 justify-end border-t border-[#DDD5C7] bg-white px-5 py-3 sm:px-7">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>{copy.close}</Button>
            </footer>
          </div>
        </div>
      )}
    </section>
  );
}
