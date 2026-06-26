import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RENOVA Circular - ESG & EPR Platform",
  description: "Trang thông tin, bộ công cụ tính toán tác động môi trường (ESG Data) và quy trình số hóa hợp đồng EPR của dự án gạch sinh thái RENOVA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        {/* Google Fonts: Outfit (headings) + Plus Jakarta Sans (body) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
