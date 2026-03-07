"use client";

import { Trash2 } from "lucide-react";
import { deleteOrder } from "@/app/dashboard/actions";

interface DeleteButtonProps {
  orderId: string;
  orderNumber: string;
  role?: string;
  username?: string;
}

export default function DeleteButton({
  orderId,
  orderNumber,
  role,
  username,
}: DeleteButtonProps) {
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // 阻止 Link 的跳转行为
    if (confirm(`确定要删除订单 #${orderNumber} 吗？`)) {
      await deleteOrder(orderId, role, username);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all pointer-events-auto"
      title="删除订单"
    >
      <Trash2 size={18} />
    </button>
  );
}
