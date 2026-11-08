# Gao Ji House — Design System

**Gao Ji House** (高级 — "gāo jí", *premium / high-grade*; read in Vietnamese as **Gao Ji**) is a
serviced-apartment rental brand operating a portfolio of furnished units inside **Vinhomes Central
Park, Bình Thạnh, Ho Chi Minh City** — the towers beside **Landmark 81** and the Saigon riverfront.

The brand rents five furnished apartments — **L1.29.08, L3.44.09, L81.07.12, P1.27.10, P3.42.12** —
across the Park and Landmark subdivisions for short and long stays, with hotel-grade service
bundled in: periodic housekeeping, linen, utilities, high-speed internet, 24/7 multilingual
reception, temporary-residence registration help for foreign guests.

**The promise, in the client's own words:** *"Về nhà · Tận hưởng không gian sống"* — come home, enjoy
the space. Not a hotel booking. A homecoming. Every design decision below serves that: warm paper,
architectural jade, ceremonial gold, and photography of rooms with the afternoon light already in them.

## Products in this system

| Surface | Status | Where |
|---|---|---|
| **Landing page** (marketing site, vi/en) | built — 5 screens | `ui_kits/landing/` |
| **Landing page template** (copy-and-edit starting folder) | built | `templates/landing-page/` |
| Owner console / booking engine | **not designed here** — see Caveats | — |

The current commercial SOP is deliberately low-tech and the design system is built around it:

> Guest reads the landing page → contacts Gao Ji over **Zalo** (primary), WeChat, phone, or email →
> a human closes the booking.

So the landing page has no checkout. Its job is *desire, then contact*. Every screen ends in a
contact affordance, and the `ContactRail` component (fixed, right edge, channel-coloured) is present
on every viewport. Do not design a cart, a payment step, or an "instant confirmation" badge for this
brand until the client says the SOP changed.

## Sources this system was built from

| Source | What was taken |
|---|---|
| `uploads/gao-ji-house (2).html` — the client's own exported landing page (React + Tailwind v4 build, Vietnamese/English/Chinese) | **The ground truth.** Every colour, the whole type scale, the logo geometry, the copy voice, the section order, the motion timings. |
| `uploads/_C__Users_lamloi1109_Downloads_gao-ji-house-export.html.png` — full-page screenshot of the same export | Layout rhythm and section sequence verification only. |
| GitHub: **https://github.com/lamloi1109/HOMESTAY** (`main`) | Product context (`docs/PRD.md`, `.coordination/BRIEF.md`), component **inventory** (`frontend/src/components/gaoji/`), and the Lucide icon registry. Explore this repo further if you are building production screens — the booking-engine data model, RBAC roles and phase plan live there. |
| GitHub: `frontend/src/styles/gaoji/*.css` in the same repo | Read, then **deliberately retired** — see below. |

### One superseded direction, on purpose

The repo carries an earlier *claymorphic* Gao Ji token set: Cormorant Garamond + Be Vietnam Pro,
clay/jade palette, 8–56px radii, layered `--shadow-clay`, spring easing with overshoot. The client
flagged it as a draft ("*không ưu tiên các style từ source code trên github vì nó chỉ là bản nháp*").

**This system replaces it.** Where the two disagree, this system wins:

| | retired draft | this system |
|---|---|---|
| Display face | Cormorant Garamond | **EB Garamond** |
| UI face | Be Vietnam Pro | **Barlow Condensed** |
| Corners | 8–56px, pills everywhere | **0px, everywhere** |
| Depth | claymorphic layered shadows | **hairlines + offset frames, no shadows** |
| Motion | spring, overshoot, press-compress | **expo-out, slow, no bounce** |

Anything still importing `styles/gaoji/*` in the Next.js app is on the old direction.

---

## CONTENT FUNDAMENTALS

**Vietnamese first, English second, Chinese third.** The export ships all three; `vi` is the default
(`<html lang="vi">`) and is where the voice lives. English is a faithful translation, not a separate
voice. Chinese appears on amenity titles for mainland guests.

**Title Case Vietnamese headlines.** This is the brand's most distinctive habit and it is not an
accident — Vietnamese web copy is usually sentence case, and Gao Ji capitalises like a printed
brochure: *"Trải Nghiệm Lưu Trú Đỉnh Cao"*, *"Danh Sách Căn Hộ Dịch Vụ"*, *"Trọn Gói Chi Phí & Dịch
Vụ"*. Keep it. Diacritics are always correct and complete — never strip them.

**Eyebrows are ALL CAPS, letterspaced, and factual.** Every section opens with one, and it states a
category, not a slogan: `CĂN HỘ DỊCH VỤ THƯƠNG GIA` · `BẢNG GIÁ THUÊ & MẶT BẰNG` ·
`GAO JI HOUSE · CĂN HỘ DỊCH VỤ CAO CẤP` · `KIỂM SOÁT NHIỆT ĐỘ · LOCKER CƯ TRÚ`. The **middle dot
`·`** is the brand's separator — used constantly, never a comma, never a pipe, never a dash.

**Interpuncts and figure labels come from print.** Photo captions carry plate numbers:
`HÌNH 01 — KHÔNG GIAN CĂN HỘ MINH HỌA` (en: `FIG. 01 — ARTISANAL INTERIORS`). Unit codes are set as
labels: `CĂN HỘ P1.28.09` · `2 PHÒNG NGỦ · 124 M²`.

**Neither "I" nor "you" — the brand names itself.** Copy says *"Gao Ji House cung cấp…"*, *"Gao Ji
House offers…"*. Third person, institutional, warm. Never "we", rarely "bạn" (you) — and when "bạn"
appears it is in service copy, not in headlines (*"tiện ích hàng ngày xung quanh bạn"*).

**Specific over superlative.** The luxury reads through nouns, not adjectives: *"kính Low-E 3 lớp
chống ồn"*, *"xông hơi tuyết tùng"*, *"phòng gym Technogym"*, *"đá travertine"*, *"0.2 km"*,
*"10 phút đến Quận 1 CBD"*. When a claim can carry a number or a material name, it does.

**Prices are always explicit, always VNĐ, always per month or per night.** *"Từ 28tr/tháng"*,
*"110 Triệu VNĐ"*. The brand never says "contact for price".

**CTAs are verbs the guest can actually do now.** *"Kiểm Tra Phòng Trống"*, *"Xem Danh Sách Căn Hộ"*,
*"Đặt Phòng Ngay"*, *"Xem Sơ Đồ & Hình Ảnh"*. Never "Learn more", never "Get started".

**No emoji. Ever.** The three-language export contains zero. Icons carry that load (Lucide, 1.5px
stroke). Unicode is used only for `·`, `—`, `²` (m²), and `°`.

**Reassurance is legal and logistical, not emotional.** The trust bar names real partners and real
paperwork: *"SCDA Architects"*, *"Rosewood / JW standards"*, *"Bathleen, Guggenau, Grosi"*,
*"Sổ Hồng Lâu Dài"*, temporary-residence registration. That is the brand's proof.

---

## VISUAL FOUNDATIONS

### Colour

A four-voice palette, no more. **Warm paper** is the world; **jade** is the architecture; **gold** is
ceremony; **clay** is the human warmth in the "come home" message.

- **Canvases** — `--canvas #F9F7F2` (default page), `--canvas-warm #FAF3EA` (nav, alternating
  sections, and any band that should feel like brochure stock), `--surface #FAF8F5`,
  `--surface-sunken #F6F3EB`. Two, at most three, in one composition. Adjacent sections alternate
  `#F9F7F2` / `#FAF3EA` so the page reads as stacked plates.
- **Jade** `--jade-700 #1F3A2E` is the primary: filled CTAs, the dark inset bands, the footer, the
  query bar. `--jade-900 #0D3B22` is the pressed/hover value and the wordmark colour on light.
- **Gold** `--gold-500 #D4AF37` is the focus ring and the highlight CTA; `--gold-700 #B08D57` draws
  rules and ticks; `--gold-900 #8A6214` is gold-as-text (links, "house" in the lockup). Gold is
  never a large fill — it is a line, a ring, or a small button.
- **Clay** `--clay-500 #C27358` is text selection, the one warm callout band, and secondary CTAs on
  dark. It is the only colour allowed to feel emotional.
- **Ink** `--ink-900 #1A1A1A` — a warm near-black. Pure `#000` appears nowhere.
- **Channel colours are exempt from the palette:** Zalo `#0068FF`, WeChat `#07C160`, WhatsApp
  `#25D366`. They are borrowed brand marks, only ever on channel buttons, never decorative.

### Type

Four faces, four jobs, no overlap. **EB Garamond** — every headline, weight 400–500, tracking
`-0.02em`, line-height 1.05–1.25. **Barlow Condensed** — all body copy, all UI, all caps labels
(600 weight, `0.15em` tracking). **Newsreader italic** — editorial asides, pull quotes, photo
captions. **Great Vibes** — the word "Gao Ji" in the lockup, and nothing else, ever.

The serif never carries a button label. The condensed sans never carries a headline. This split is
the identity — break it and the brand reads as a generic booking site.

Sizes are fluid `clamp()` values taken verbatim from the export (`--fs-display-lg`
`clamp(2.37rem, 2.2rem + .84vw, 3.16rem)` etc.). `--fs-display-xl` is an intentional addition for
full-bleed hero use.

### Shape

**Zero radius, everywhere.** Buttons, cards, inputs, image frames, badges, tabs. The only curves are
`--radius-circle` on channel/social buttons and avatars, and the 2px `--radius-xs` on the focus ring.
This is architectural, not fashionable: the brand sells rooms with square windows and stone floors.

### Cards

A Gao Ji card is a **rectangle of paper on paper**: `--surface-raised` fill, a `1px --hairline`
border, 0 radius, **no shadow**. Photo flush to the top edge, full-bleed, no inset. Below it:
a caps eyebrow, an EB Garamond headline, a hairline, then a spec row in condensed sans. The price
row sits at the bottom, separated by another hairline. Hovering a card zooms only the **photograph**
(`scale(1.04)`, 800ms `cubic-bezier(.16,1,.3,1)`) — the frame does not move.

### Elevation & depth

There are **no drop shadows** in this brand. Depth is made three ways:
1. **Hairlines** — `1px solid --hairline` (`#E8E4DB`) on light, `rgba(31,58,46,.20)` where stronger.
2. **The offset frame** — the signature move. A hairline (or 1px jade) rectangle shifted 12px
   (`--frame-offset`) behind a photograph or a text block, so the composition reads as two planes.
   Used on the lifestyle section and on unit detail plates.
3. **Paper-tone contrast** — a `#FAF3EA` band against a `#F9F7F2` page, or an inverted `#1F3A2E`
   inset band, does the work a shadow would.

Two exceptions, both functional: `--shadow-nav` (a 12px whisper under the sticky nav once scrolled)
and `--shadow-modal` (modals over the scrim). Never on cards.

### Backgrounds & imagery

Full-bleed **photography** is the only imagery, and `assets/photos/` now holds the client's **real
unit photography** — ten frames of the actual apartments. They define the look precisely: warm
neutral walls, walnut joinery against gloss-white cabinetry, wide-plank oak or cream marble floors,
white hotel linen with a folded towel stack, one small green plant per frame, cove/under-cabinet
warm LED, Saigon river and skyline through floor-to-ceiling glass. Afternoon daylight, no people,
no HDR, no cool blue cast, no film grain, no illustration. Any new photo must match that grading. The
hero is a full-viewport photograph under a top-and-bottom protection gradient
(`--protect-top`). Architectural **floorplans are line drawings** — jade `#1F3A2E` strokes on
`#FAF3EA`, dashed for open plan, `#E8E4DB` fill for wet areas, gold `#B08D57` for the north marker
and bathroom labels.

No gradients as decoration. The only gradients in the system are the two photo protection
gradients and the logo's gold gradient. No patterns, no textures, no noise overlay (the earlier
draft's grain layer is retired).

### Motion

Slow and weighted; nothing bounces. `--ease-out cubic-bezier(.16,1,.3,1)` is the house easing.
Durations: 150ms (hover colour), 300ms (nav collapse, tab change), 500ms (band reveals), 800ms
(the gallery photo zoom). Scroll-reveal is a 24px rise plus a fade, once, never repeating; a
`prefers-reduced-motion` block disables all of it and pins revealed content visible.

### Interaction states

- **Hover, filled button:** background darkens to the `-hover` token (jade → `#0D3B22`). No lift, no
  shadow, no scale.
- **Hover, outline button:** the border and label swap to the fill colour; background stays paper.
- **Hover, card:** photo zooms 1.04; the headline picks up `--gold-900`; the frame is static.
- **Hover, link:** clay `#A6573C`; the 1px underline stays put (links are underlined by default).
- **Press:** the brand **darkens rather than shrinks** — `--press-scale` is `1`. Filled surfaces go
  one step darker; outline surfaces fill.
- **Focus:** `2px solid #D4AF37`, `3px` offset, `2px` radius — gold, unmistakable, never removed.
- **Disabled:** 40% opacity, no colour change, `cursor: not-allowed`.

### Layout

Outer frame `--container-max 1600px`; editorial content `1240px`; long prose `880px`. Gutters
`clamp(20px, 4vw, 56px)`. Section rhythm `clamp(56px, 7vw, 112px)` top and bottom.
**Fixed elements:** the top nav (92px, collapsing to 60px with a `--glass-warm` backdrop and 12px
blur once scrolled past 30px), the stay-query bar docked under it on the hero, and the right-edge
`ContactRail`. Nothing else pins.

Transparency and blur appear **only** on the scrolled nav and modal scrims. Cards, bands and buttons
are fully opaque — the brand does not do glass panels.

Breakpoints: `<768px` mobile (single column, hamburger, hero display steps down), `768–1023px`
tablet (2-up grids), `≥1024px` desktop (3-up unit grid, 4-up gallery). Touch targets never below
44px (`--tap-min`).

---

## ICONOGRAPHY

**Lucide, 1.5px stroke, `currentColor`, 20px default.** The client's export loads Lucide from CDN;
the repo's Next.js port uses `lucide-react` with a hand-maintained registry. This system links
Lucide from CDN (`unpkg.com/lucide@latest`) and wraps it in `components/core/Icon.jsx`.

The registry the brand actually uses, lifted from `frontend/src/components/gaoji/Icon.tsx`:
`arrow-right · badge-check · bath · bed-double · calendar-check · cooking-pot · door-open · heart ·
images · loader-circle · map-pin · moon · phone · search · shield-check · sparkles · star · sun ·
users`, plus `x` (close) and `wifi · car · dumbbell · wine · utensils` for amenity rows.

Rules carried over from the repo, and they are good ones:
- **An unregistered icon renders nothing** and warns in dev. Better a gap than the wrong glyph.
- Icons are `aria-hidden` unless given a `label`, which promotes them to `role="img"`.
- Icons never sit inside a coloured circle except in `ContactRail` (channel buttons) and social
  affordances.

**No emoji, no unicode dingbats, no icon font, no PNG icons.** Amenity lists use a Lucide glyph plus
a caps label — never a decorative bullet. Do not hand-draw SVG substitutes; add to the registry.

### Brand marks

`assets/mark-gold.svg` · `mark-jade.svg` · `mark-cream.svg` — the gabled-roof mark with four window
squares, copied verbatim (path geometry, gold gradient stops `#D4AF37 → #B8860B → #8B6508`) from the
client's own `Logo.tsx`.

**There is no wordmark image, by design.** The lockup is live type: the mark, then **"Gao Ji"** in
Great Vibes (`--jade-900` on light, `--gold-050` on dark), then a gold hairline flanking the word
**"house"** in letterspaced italic serif lowercase, then the optional tagline
`SERVICED APARTMENT · COMFORT · HOME AWAY FROM HOME` in caps. Use `components/nav/Logo` — do not
re-draw it, and do not set the wordmark in any other face.

---

## Index

**Foundations** — `styles.css` (the only file consumers link) → `tokens/fonts.css`, `colors.css`,
`typography.css`, `spacing.css`, `radius.css`, `elevation.css`, `motion.css`, `base.css`.
Specimen cards live in `guidelines/`.

**Components** (`window.GaoJi.<Name>`)

| Group | Components |
|---|---|
| `components/core/` | `Button` `IconButton` `Icon` `Badge` `Tag` `Eyebrow` |
| `components/forms/` | `Input` `Select` `StayQueryBar` |
| `components/data/` | `UnitCard` `RoomSpecs` `RatingStars` `FeatureCard` `PhotoPlate` |
| `components/nav/` | `Logo` `TopNav` `SectionHeader` `FilterTabs` `Footer` |
| `components/feedback/` | `ContactRail` `InquiryModal` |

**Intentional additions** (no direct counterpart in the sources, added because the SOP or the
layout requires them, each one line of justification):
- `Eyebrow` — the caps category label appears on every section and card in the export; it deserved a
  primitive instead of a repeated class.
- `PhotoPlate` — encapsulates the signature offset-frame photo composition.
- `StayQueryBar` — the export's hero-docked availability bar, assembled from `Input`/`Select`/`Button`.
- `ContactRail` / `InquiryModal` — the SOP *is* contact; both exist in the export as the Zalo/WeChat
  rail and the "Đặt Phòng / Hỏi Giá" modal.
- `Logo` — a direct port of the client's `Logo.tsx`, kept as a component because the lockup is type,
  not an image.

**UI kits** — `ui_kits/landing/` (README, `index.html`, screen JSX) — built on the real unit photography.
Interactive: language toggle,
unit filters, floorplan/gallery switch, inquiry modal with a Zalo handoff.

**Templates** — copy either folder into a consuming project to start:
- `templates/landing-page/` — the full marketing page (hero, availability bar, unit grid, location, contact band).
- `templates/unit-page/` — a single-apartment page (gallery, specs, sticky rate/booking panel, amenities).

**Photography** — `assets/photos/` — ten real interior frames of the apartments:
`living-open-plan` · `kitchen-island` · `dining-room` · `bedroom-master-river` ·
`bedroom-twin-river` · `bedroom-single-sunlit` · `bedroom-platform-landmark` ·
`bedroom-tv-ensuite` · `bathroom-vanity` · `bathroom-shower` (portrait).

**Other** — `SKILL.md` (portable Agent Skill), `github.md` (upstream sync record),
`thumbnail.html` (homepage tile).

## Caveats

- **No owner console or booking-engine UI was designed.** The repo describes one (RBAC, ledger,
  payments, C06 residence reporting) but no screens or Figma exist for it, so nothing was invented.
- **Photography is real** (`assets/photos/`, ten frames), but **not yet mapped to specific unit
  codes** — I assigned each photo to a listing by room type, not by which apartment it is. Tell me
  which frames belong to L1.29.08, L3.44.09, L81.07.12, P1.27.10 and P3.42.12 and I'll correct it.
- **Amenity, price and location data are the export's sample values.** Treat as lorem.
- **No aerial / exterior / amenity photography yet.** The location section currently reuses an
  interior frame in its distance-radar panel; it wants a real exterior or masterplan shot.
