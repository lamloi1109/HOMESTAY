import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Barlow_Condensed, EB_Garamond, Great_Vibes, Newsreader } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

// Bộ typography nghệ thuật & hiện đại:
// - Cormorant Garamond / EB Garamond: Display / Headlines có chân nghệ thuật, thanh lịch, sang trọng
// - Inter: Sans-serif hiện đại cho toàn bộ thông số, bảng giá, form, nút thao tác và UI
// - Barlow Condensed: Sans-serif phụ cho các thẻ nhãn tag/eyebrow
// - Newsreader: Editorial italic asides
// - Great Vibes: Script wordmark
const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
});

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

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: ["400"],
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
      className={`${cormorantGaramond.variable} ${inter.variable} ${ebGaramond.variable} ${barlowCondensed.variable} ${newsreader.variable} ${greatVibes.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("gh-theme");if(t==="dark"||t==="light"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}`,
          }}
        />
      </head>
      <body
        className="flex min-h-full flex-col bg-[var(--canvas,#F9F7F2)]"
        suppressHydrationWarning
      >
        <LanguageProvider>
          <Header />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
