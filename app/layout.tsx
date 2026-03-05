import { Noto_Sans_SC } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans_SC({
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={notoSans.className}>{children}</body>
    </html>
  );
}
