import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role");

  const notifications = await db.notification.findMany({
    where: {
      target: role as string,
      isRead: false,
    },
  });

  return NextResponse.json({ notifications });
}
