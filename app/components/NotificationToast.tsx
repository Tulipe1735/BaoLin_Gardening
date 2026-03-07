"use client";

import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  markAsRead,
  getLatestUnreadNotification,
} from "@/app/dashboard/actions";

export default function NotificationToast() {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);
  const [latestUnread, setLatestUnread] = useState<any>(null);

  // 从 URL 自动获取身份信息
  const role = searchParams.get("role");
  const username = searchParams.get("username");

  useEffect(() => {
    // 如果没有身份信息（比如在登录页），不执行任何逻辑
    if (!role) return;

    const checkNotifications = async () => {
      try {
        // 调用我们待会儿要补全的 getLatestUnreadNotification action
        const notif = await getLatestUnreadNotification(role);

        if (notif) {
          setLatestUnread(notif);
          // 延迟一点点显示，体验更丝滑
          setTimeout(() => setShow(true), 1000);

          // 8秒后自动隐藏（不标记已读，用户下次刷新还能看到，直到点 X）
          const timer = setTimeout(() => setShow(false), 8000);
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error("获取通知失败:", error);
      }
    };

    checkNotifications();

    // 每次 URL 变化（页面跳转）时重新检查一次是否有新通知
  }, [role, searchParams]);

  const handleClose = async () => {
    setShow(false);
    if (latestUnread && role && username) {
      try {
        // 点击 X 代表确认已读
        await markAsRead(latestUnread.id, role, username);
        // 清空状态，防止重复触发
        setLatestUnread(null);
      } catch (error) {
        console.error("标记已读失败:", error);
      }
    }
  };

  if (!latestUnread) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[999] w-[92%] max-w-sm transition-all duration-700 ease-in-out ${
        show
          ? "translate-y-0 opacity-100 scale-100"
          : "-translate-y-32 opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div className="bg-slate-900/95 text-white p-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-start gap-3 border border-white/10 backdrop-blur-xl">
        {/* 铃铛图标带动画 */}
        <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-500/20">
          <Bell size={20} className="animate-ring text-white" />
        </div>

        <div className="flex-1 pt-0.5">
          <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-1">
            New Notification
          </p>
          <p className="text-sm font-semibold leading-relaxed text-slate-100 line-clamp-2">
            {latestUnread.message}
          </p>
        </div>

        {/* 关闭按钮 */}
        <button
          onClick={handleClose}
          className="p-1 hover:bg-white/10 rounded-full transition-colors active:scale-90"
        >
          <X size={18} className="text-slate-400" />
        </button>
      </div>

      {/* 底部装饰条，增加精致感 */}
      <div className="mt-2 mx-auto w-1/3 h-1 bg-slate-400/20 rounded-full blur-[1px]" />
    </div>
  );
}
