import { db } from "@/lib/db";
import Link from "next/link";
import { ChevronLeft, Package, StickyNote, History, User2 } from "lucide-react";

import { notFound } from "next/navigation";
import ImageUpload from "@/app/components/ImageUpload";

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ role?: string; username?: string }>;
}) {
  const { id } = await params;
  const { role, username } = await searchParams;

  // 获取订单详情
  const order = await db.order.findUnique({
    where: { id },
  });

  if (!order) {
    notFound();
  }

  const isExecuted = order.status === "EXECUTED";

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* 顶部导航栏 */}
      <div className="bg-white p-4 flex items-center justify-between sticky top-0 z-10 shadow-sm border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/orders?role=${role}&username=${username}`}
            className="p-1 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ChevronLeft className="text-slate-600" />
          </Link>
          <h1 className="font-bold text-slate-800">订单详情</h1>
        </div>
        <div className="flex items-center gap-1 text-[10px] bg-slate-100 px-2 py-1 rounded-md text-slate-500">
          <User2 size={12} />
          {username} ({role === "DISPATCHER" ? "配货" : "客服"})
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-4">
        {/* 1. 状态与单号卡片 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                isExecuted
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {isExecuted ? "● 已归档" : "● 待处理"}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              ID: {order.id.slice(-8)}
            </span>
          </div>

          <h2 className="text-3xl font-black text-slate-900 mb-1">
            #{order.orderNumber}
          </h2>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <History size={12} />
            创建于: {order.createdAt.toLocaleString()}
          </p>
        </div>

        {/* 2. 核心信息卡片 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-5">
          <div className="flex gap-4">
            <div className="bg-blue-50 p-3 rounded-xl h-fit">
              <Package className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                产品规格
              </p>
              <p className="text-slate-700 leading-relaxed font-medium">
                {order.productSpecs}
              </p>
            </div>
          </div>

          <div className="flex gap-4 border-t border-slate-50 pt-5">
            <div className="bg-amber-50 p-3 rounded-xl h-fit">
              <StickyNote className="text-amber-600" size={20} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                备注信息
              </p>
              <p className="text-slate-600 text-sm">
                {order.notes || "无特殊说明"}
              </p>
            </div>
          </div>
        </div>

        {/* 3. 附件区 (图片展示) */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-800">配货凭证</h3>
            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">
              {order.images.length} 张图片
            </span>
          </div>

          {/* 如果已经归档且没图片的情况 */}
          {isExecuted && order.images.length === 0 && (
            <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-2xl">
              <p className="text-sm text-slate-400">该订单无上传凭证</p>
            </div>
          )}

          {/* 如果是客服，或者已经归档的配货员，只看图片不显示 ImageUpload 组件 */}
          {(role === "CUSTOMER_SERVICE" || isExecuted) && (
            <div className="grid grid-cols-2 gap-3">
              {order.images.map((img, idx) => (
                <div key={idx} className="aspect-square">
                  <img
                    src={img}
                    alt="凭据图片"
                    className="w-full h-full object-cover rounded-xl border border-slate-100"
                  />
                </div>
              ))}
            </div>
          )}

          {/* 4. 关键交互：仅 PENDING 状态下的配货员可以操作 */}
          {!isExecuted && role === "DISPATCHER" && (
            <ImageUpload
              orderId={order.id}
              currentImages={order.images}
              role={role}
              username={username || ""}
            />
          )}
        </div>
      </div>

      {/* 底部提示 */}
      {isExecuted && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md p-3 text-center border-t border-slate-100">
          <p className="text-xs font-semibold text-green-600 flex items-center justify-center gap-1">
            已完成配货，相关通知已发送给客服
          </p>
        </div>
      )}
    </div>
  );
}
