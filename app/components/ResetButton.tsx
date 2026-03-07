"use client";

import { RotateCcw, Loader2 } from "lucide-react";
import { resetOrder } from "@/app/dashboard/actions";
import { useState } from "react";

interface ResetButtonProps {
  orderId: string;
  orderNumber: string;
  role?: string;
  username?: string;
}

export default function ResetButton({
  orderId,
  orderNumber,
  role,
  username,
}: ResetButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const handleReset = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (
      !confirm(
        `确定要重置订单 #${orderNumber} 吗？这会清空所有已上传图片并让配货员重新处理。`,
      )
    ) {
      return;
    }

    setIsPending(true);
    try {
      await resetOrder(orderId, role, username);
    } catch (err) {
      alert("重置失败");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleReset}
      disabled={isPending}
      className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-full transition-all disabled:opacity-50"
      title="重置订单"
    >
      {isPending ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <RotateCcw size={18} />
      )}
    </button>
  );
}
