import { db } from "@/lib/db";
import Link from "next/link";
import { ChevronLeft, Bell, CheckCheck, Inbox, Check } from "lucide-react";
import { markAllAsRead, markAsRead } from "@/app/dashboard/actions";

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; username?: string }>;
}) {
  const { role, username } = await searchParams;

  const notifications = await db.notification.findMany({
    where: { target: role },
    orderBy: { createdAt: "desc" },
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* 顶部导航 */}
      <div className="bg-white p-4 flex items-center justify-between shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/orders?role=${role}&username=${username}`}
            className="p-1 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ChevronLeft className="text-slate-600" />
          </Link>
          <h1 className="font-bold text-slate-800 text-lg">通知中心</h1>
        </div>

        {unreadCount > 0 && (
          <form
            action={async () => {
              "use server";
              await markAllAsRead(role || "");
            }}
          >
            <button className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full active:scale-95 transition-all">
              <CheckCheck size={14} />
              全部已读
            </button>
          </form>
        )}
      </div>

      <div className="p-4 max-w-md mx-auto space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-24 text-slate-400">
            <Inbox size={48} className="mx-auto mb-4 opacity-10" />
            <p className="text-sm">暂时没有收到任何通知</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                notif.isRead
                  ? "bg-white/60 border-slate-100 opacity-70"
                  : "bg-white border-blue-100 shadow-sm ring-1 ring-blue-50/50"
              }`}
            >
              {/* 左侧：通知内容 */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {!notif.isRead && (
                  <span className="w-2 h-2 mt-1.5 bg-blue-500 rounded-full shrink-0 animate-pulse" />
                )}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm leading-relaxed break-words ${
                      notif.isRead
                        ? "text-slate-600"
                        : "text-slate-900 font-medium"
                    }`}
                  >
                    {notif.message}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                    <Bell size={10} />
                    {new Date(notif.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* 右侧：标记已读按钮（仅在未读时显示） */}
              {!notif.isRead && (
                <form
                  action={async () => {
                    "use server";
                    // 调用已有的 markAsRead action
                    await markAsRead(notif.id, role || "", username || "");
                  }}
                  className="shrink-0"
                >
                  <button
                    type="submit"
                    className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 active:scale-90 transition-all shadow-sm border border-blue-100"
                    title="标记为已读"
                  >
                    <Check size={18} strokeWidth={3} />
                  </button>
                </form>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
