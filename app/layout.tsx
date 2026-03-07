import { Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import NoticeListener from "@/app/components/NotificationToast";

const notoSans = Noto_Sans_SC({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto",
  display: "swap",
});

export const metadata = {
  title: "宝林园艺管理系统",
  description: "Internal Management System for Baolin Gardening",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={notoSans.variable}>
      <body
        className={`${notoSans.className} antialiased bg-slate-50 text-slate-900`}
      >
        {/* 全局通知监听：
            因为它在 RootLayout，它将出现在所有页面。
            组件内部需要使用 useSearchParams 来获取 role 以查询通知。
        */}
        <NoticeListener />

        {children}
      </body>
    </html>
  );
}
