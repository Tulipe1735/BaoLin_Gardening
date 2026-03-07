"use client";

import Link from "next/link";
import { History } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function HistoryButton() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const username = searchParams.get("username");

  return (
    <Link
      href={`/dashboard/history?role=${role || ""}&username=${username || ""}`}
      className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-blue-600 transition-colors"
    >
      <History size={20} />
    </Link>
  );
}
