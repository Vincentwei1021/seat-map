import type { Metadata } from "next";
import { Noto_Sans_SC } from "next/font/google";
import "./globals.css";

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://seat.toolboxlite.com"),
  title: "座位表生成器 - 在线班级座位编排工具",
  description:
    "免费在线座位表生成器，支持多种教室布局、拖拽排座、随机分配、男女间隔，一键导出图片或打印。",
  keywords:
    "座位表生成器, 班级座位编排, 教室座位表, 随机排座, 座位表模板",
  alternates: {
    canonical: "https://seat.toolboxlite.com",
  },
  openGraph: {
    title: "座位表生成器 - 在线班级座位编排工具",
    description:
      "免费在线座位表生成器，支持多种教室布局、拖拽排座、随机分配、男女间隔，一键导出图片或打印。",
    url: "https://seat.toolboxlite.com",
    siteName: "座位表生成器",
    locale: "zh_CN",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "座位表生成器",
  description:
    "免费在线座位表生成器，支持多种教室布局、拖拽排座、随机分配、男女间隔，一键导出图片或打印。",
  url: "https://seat.toolboxlite.com",
  applicationCategory: "EducationalApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "CNY",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${notoSansSC.className} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5881105388002876"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col bg-gray-50">{children}</body>
    </html>
  );
}
