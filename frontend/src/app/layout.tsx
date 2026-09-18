import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { PublicChrome } from "@/components/PublicChrome";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const DEFAULT_TITLE = `${SITE_NAME} — Vinhomes Central Park 高端服务式公寓`;
const DEFAULT_DESCRIPTION = "Gao Ji House 提供胡志明市 Vinhomes Central Park 高端服务式公寓的短租与长租咨询。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
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
      lang="zh-CN"
      data-theme="light"
      className="h-full antialiased"
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
          <PublicChrome>{children}</PublicChrome>
        </LanguageProvider>
      </body>
    </html>
  );
}
