import { db } from "@/lib/db";
import Link from "next/link";
import { PlusCircle, User2 } from "lucide-react";
import DeleteButton from "@/app/components/DeleteButton";
import HistoryButton from "@/app/components/HistoryButton";
import NotificationBell from "@/app/components/NoticeButton";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; username?: string }>;
}) {
  const { role, username } = await searchParams;

  const unreadCount = await db.notification.count({
    where: {
      target: role,
      isRead: false,
    },
  });

  const orders = await db.order.findMany({
    where: {
      status: "PENDING", // 只显示PENDING状态的订单
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const isDispatcher = role === "DISPATCHER";

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* 顶部导航 */}
      <div className="bg-white p-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
        <h1 className="font-bold text-slate-800 text-lg">订单管理</h1>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
            <User2 size={14} />
            {username}
          </div>
          <NotificationBell unreadCount={unreadCount} />
          <HistoryButton />
          {/* 只有客服可以创建订单 */}
          {role === "CUSTOMER_SERVICE" && (
            <Link
              href={`/dashboard/orders/new?role=${role}&username=${username}`}
              className="flex items-center gap-1 text-blue-600 font-bold text-sm"
            >
              <PlusCircle size={18} />
              新建
            </Link>
          )}
        </div>
      </div>

      {/* 订单列表容器 */}
      <div className="p-4 max-w-md mx-auto space-y-3">
        {orders.length === 0 && (
          <div className="text-center text-slate-400 py-20 flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
              📦
            </div>
            <p className="text-sm">暂无订单数据</p>
          </div>
        )}

        {orders.map((order) => (
          <div key={order.id} className="relative group">
            {/* 订单卡片主体 */}
            <Link
              href={`/dashboard/orders/${order.id}?role=${role}&username=${username}`}
              className="block bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-100 transition-all active:scale-[0.98]"
            >
              <div className="flex justify-between items-start pr-10">
                <div className="space-y-1">
                  <p className="font-black text-slate-800 text-lg leading-none">
                    #{order.orderNumber}
                  </p>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {order.productSpecs}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {order.createdAt.toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                      order.status === "EXECUTED"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {order.status === "EXECUTED" ? "已归档" : "待处理"}
                  </span>
                </div>
              </div>
            </Link>

            {/* 删除按钮组件：绝对定位在右侧 */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20">
              <DeleteButton
                orderId={order.id}
                orderNumber={order.orderNumber}
                role={role}
                username={username}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 底部悬浮身份提示 (仅配货员) */}
      {isDispatcher && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur text-white px-5 py-2.5 rounded-full shadow-2xl text-xs font-bold flex items-center gap-2 border border-white/10">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            当前身份：配货员模式
          </div>
        </div>
      )}
    </div>
  );
}
