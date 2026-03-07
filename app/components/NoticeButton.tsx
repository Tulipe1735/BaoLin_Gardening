"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface NotificationBellProps {
  unreadCount: number;
}

export default function NotificationBell({
  unreadCount,
}: NotificationBellProps) {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const username = searchParams.get("username");

  return (
    <Link
      href={`/dashboard/notifications?role=${role || ""}&username=${username || ""}`}
      className="relative p-2 text-slate-500 hover:bg-slate-100 active:bg-slate-200 rounded-full transition-all"
    >
      <Bell size={22} />

      {unreadCount > 0 && (
        <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
