import type { Metadata } from "next";
import { Be_Vietnam_Pro, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Cặp chữ của design system Gaoji House: serif biên tập cho tiêu đề lớn,
// grotesque Việt cho phần còn lại. next/font tự host nên không gọi ra CDN.
const beVietnam = Be_Vietnam_Pro({
  variable: "--font-bvp",
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Gaoji House — Tìm nơi trú ẩn hoàn hảo của bạn",
  description:
    "Đặt phòng trực tiếp những không gian ấm áp, mang đậm chất liệu tự nhiên và bản sắc mộc mạc khắp Việt Nam.",
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
      className={`${beVietnam.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
