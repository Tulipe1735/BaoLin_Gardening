// @/app/dashboard/history/page.tsx (假设的路径)
import { db } from "@/lib/db";
import Link from "next/link";
import { ChevronLeft, Archive, Calendar, Search } from "lucide-react"; // 新增 Search 图标
import ResetButton from "@/app/components/ResetButton";
import DeleteButton from "@/app/components/DeleteButton";
import SearchBar from "@/app/components/SearvhBar";

interface HistoryPageProps {
  searchParams: Promise<{
    role?: string;
    username?: string;
    q?: string;
  }>;
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  // 这里的 await 是 Next.js 15+ 的要求，如果是旧版本直接解构即可
  const params = await searchParams;
  const { role, username, q } = params;

  const historyOrders = await db.order.findMany({
    where: {
      status: "EXECUTED",
      // 如果有搜索词，匹配订单号
      ...(q
        ? {
            orderNumber: {
              contains: q, // 模糊查询
              mode: "insensitive", // 忽略大小写
            },
          }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* 顶部导航 */}
      <div className="bg-white p-4 flex items-center gap-3 shadow-sm sticky top-0 z-10">
        <Link href={`/dashboard/orders?role=${role}&username=${username}`}>
          <ChevronLeft className="text-slate-600" />
        </Link>
        <h1 className="font-bold text-slate-800 text-lg">历史归档</h1>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-3">
        {/* 搜索框组件 */}
        <SearchBar defaultValue={q} />

        {historyOrders.length === 0 && (
          <div className="text-center text-slate-400 py-20">
            <Archive size={48} className="mx-auto mb-2 opacity-20" />
            <p className="text-sm">{q ? "未找到相关订单" : "暂无归档记录"}</p>
          </div>
        )}

        {historyOrders.map((order) => (
          <div key={order.id} className="relative group">
            {/* ... 保持原有卡片代码不变 ... */}
            <Link
              href={`/dashboard/orders/${order.id}?role=${role}&username=${username}`}
              className="block bg-white rounded-2xl p-4 border border-slate-100 shadow-sm active:scale-[0.98] transition-all"
            >
              <div className="pr-24">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-slate-800">
                    #{order.orderNumber}
                  </p>
                </div>
                <p className="text-xs text-slate-500 line-clamp-1 italic mb-2">
                  {order.productSpecs}
                </p>
                <div className="flex items-center gap-3 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />
                    {new Date(order.updatedAt).toLocaleDateString()}
                  </span>
                  <span>{order.images.length} 张凭证</span>
                </div>
              </div>
            </Link>

            <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex items-center gap-1">
              {role === "CUSTOMER_SERVICE" && (
                <ResetButton
                  orderId={order.id}
                  orderNumber={order.orderNumber}
                  role={role}
                  username={username}
                />
              )}
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
    </div>
  );
}
