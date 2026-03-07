import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createOrder } from "../../actions";

export default async function NewOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; username?: string }>;
}) {
  const { role, username } = await searchParams;

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <Link
        href={`/dashboard/orders?role=${role}&username=${username}`}
        className="flex items-center text-slate-500 mb-6"
      >
        <ChevronLeft size={20} /> 返回列表
      </Link>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-6 text-slate-800">新建订单</h2>
        <form action={createOrder} className="space-y-4">
          <input type="hidden" name="role" value={role} />
          <input type="hidden" name="username" value={username} />

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              订单号
            </label>
            <input
              name="orderNumber"
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例如：SO2024001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              产品规格
            </label>
            <textarea
              name="productSpecs"
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl h-24"
              placeholder="颜色、尺寸、数量等..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              备注
            </label>
            <textarea
              name="notes"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
              placeholder="额外注意事项"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all"
          >
            确认上传
          </button>
        </form>
      </div>
    </div>
  );
}
