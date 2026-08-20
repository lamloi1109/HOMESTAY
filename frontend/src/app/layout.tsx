import type { Metadata } from "next";
import { Barlow_Condensed, EB_Garamond, Newsreader } from "next/font/google";
import "./globals.css";
import { Header, NAV_HEIGHT } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

// Bộ typography Design System Gaoji House v2:
// - EB Garamond: Display/Headlines
// - Barlow Condensed: Sans UI/Body/Caps
// - Newsreader: Editorial italic asides
const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Căn Hộ Dịch Vụ Cho Thuê · Vinhomes Central Park`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Căn Hộ Dịch Vụ Cho Thuê · Vinhomes Central Park`,
    description: SITE_DESCRIPTION,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      data-theme="light"
      className={`${barlowCondensed.variable} ${ebGaramond.variable} ${newsreader.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Đặt theme TRƯỚC khi trình duyệt vẽ, nếu không trang sẽ chớp màu sáng
          rồi mới nhảy sang tối. Phải là script chặn render, không dùng useEffect
          được. Chỉ đọc localStorage của chính mình, không nhận dữ liệu ngoài.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("gh-theme");if(t==="dark"||t==="light"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <Header />
        {/* Nav ở chế độ fixed nên phải chừa đúng chiều cao của nó. */}
        <div className="flex-1" style={{ paddingTop: NAV_HEIGHT }}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
