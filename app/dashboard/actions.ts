"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * 辅助函数：构建带身份参数的 URL
 */
const getAuthUrl = (path: string, role?: string, username?: string) => {
  return `${path}?role=${role || ""}&username=${username || ""}`;
};

/**
 * 内部辅助函数：发送通知
 */
async function sendNotification(target: string, message: string) {
  await db.notification.create({
    data: {
      target,
      message,
      isRead: false,
    },
  });
}

// ============================
// 1. 创建订单（场景一：客服创建 -> 通知配货员）
// ============================

export async function createOrder(formData: FormData) {
  const orderNumber = formData.get("orderNumber") as string;
  const productSpecs = formData.get("productSpecs") as string;
  const notes = formData.get("notes") as string | null;
  const role = formData.get("role") as string | null;
  const username = formData.get("username") as string | null;

  try {
    const order = await db.order.create({
      data: {
        orderNumber,
        productSpecs,
        notes: notes || undefined,
        status: "PENDING",
        images: [],
      },
    });

    await sendNotification(
      "DISPATCHER",
      `新任务：客服 ${username || "系统"} 创建了新订单 #${order.orderNumber}`,
    );

    revalidatePath("/dashboard/orders");
    revalidatePath("/dashboard/notifications");

    redirect(`/dashboard/orders?role=${role}&username=${username}`);
  } catch (error) {
    console.error("创建失败:", error);
    throw error;
  }
}
// ============================
// 2. 重置订单（场景二：客服重置 -> 通知配货员）
// ============================
export async function resetOrder(id: string, role?: string, username?: string) {
  if (role !== "CUSTOMER_SERVICE") throw new Error("只有客服有权重置订单");

  // 更新订单状态为 PENDING 并清空图片
  const order = await db.order.update({
    where: { id },
    data: {
      status: "PENDING",
      images: [],
    },
  });

  // 通知配货员
  await sendNotification(
    "DISPATCHER",
    `订单重做：客服 ${username || ""} 重置了订单 #${order.orderNumber}，凭证已清空，请重新配货。`,
  );

  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard/history");
  return { success: true };
}

// ============================
// 3. 执行订单（场景三：配货员归档 -> 通知客服）
// ============================
export async function executeOrder(
  id: string,
  role?: string,
  username?: string,
) {
  if (role !== "DISPATCHER") throw new Error("只有配货员有权执行归档");

  // 1. 更新订单状态为已归档
  const order = await db.order.update({
    where: { id },
    data: { status: "EXECUTED" },
  });

  // 2. 发送通知给客服
  await sendNotification(
    "CUSTOMER_SERVICE",
    `配货完成：配货员 ${username || ""} 已完成订单 #${order.orderNumber} 的配货并上传凭证。`,
  );

  // 3. 按照要求跳转回订单页
  const targetUrl = getAuthUrl("/dashboard/orders", role, username);

  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard/history");

  redirect(targetUrl);
}

// ============================
// 4. 图片管理（配货员操作）
// ============================
export async function updateOrderImages(
  id: string,
  imageUrls: string[],
  role?: string,
  username?: string,
) {
  if (role !== "DISPATCHER") throw new Error("Unauthorized");

  await db.order.update({
    where: { id },
    data: { images: imageUrls },
  });

  revalidatePath(`/dashboard/orders/${id}`);
}

export async function refreshAction(
  id: string,
  role?: string,
  username?: string,
) {
  if (role !== "DISPATCHER") throw new Error("Unauthorized");

  await db.order.update({
    where: { id },
    data: { images: [] },
  });

  revalidatePath(`/dashboard/orders/${id}`);
}

// ============================
// 5. 删除订单 (通用)
// ============================
export async function deleteOrder(
  id: string,
  role?: string,
  username?: string,
) {
  try {
    const order = await db.order.findUnique({
      where: { id },
      select: { orderNumber: true },
    });

    if (!order) return { error: "订单不存在" };

    await db.order.delete({ where: { id } });

    // 通知另一方
    const target =
      role === "CUSTOMER_SERVICE" ? "DISPATCHER" : "CUSTOMER_SERVICE";
    const roleName = role === "CUSTOMER_SERVICE" ? "客服" : "配货员";

    await sendNotification(
      target,
      `订单作废：${roleName} ${username || ""} 删除了订单 #${order.orderNumber}`,
    );

    revalidatePath("/dashboard/orders");
    revalidatePath("/dashboard/history");
    return { success: true };
  } catch (error) {
    console.error("删除失败:", error);
    return { error: "删除失败" };
  }
}

// ============================
// 6. 通知系统功能
// ============================

/**
 * 获取最新未读通知 (用于 NotificationToast 弹窗)
 */
export async function getLatestUnreadNotification(target: string) {
  try {
    return await db.notification.findFirst({
      where: { target, isRead: false },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    return null;
  }
}

/**
 * 标记单条已读
 */
export async function markAsRead(id: string, role?: string, username?: string) {
  await db.notification.update({
    where: { id },
    data: { isRead: true },
  });
  revalidatePath("/dashboard/notifications");
  revalidatePath("/dashboard/orders");
}

/**
 * 全部标记已读
 */
export async function markAllAsRead(target: string) {
  await db.notification.updateMany({
    where: { target, isRead: false },
    data: { isRead: true },
  });
  revalidatePath("/dashboard/notifications");
}

/**
 * 获取所有历史通知
 */
export async function getNotifications(target: string) {
  return await db.notification.findMany({
    where: { target },
    orderBy: { createdAt: "desc" },
  });
}
