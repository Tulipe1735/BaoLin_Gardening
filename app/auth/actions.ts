"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

// 定义校验规则：用户名至少4位，密码需包含大小写和数字
const authSchema = z.object({
  username: z.string().min(4, "用户名至少4位").max(20, "用户名太长了"),
  password: z
    .string()
    .min(8, "密码至少8位")
    .regex(/[A-Z]/, "需包含大写字母")
    .regex(/[0-9]/, "需包含数字"),
  role: z.enum(["CUSTOMER_SERVICE", "DISPATCHER"]).optional(), // 注册时传入
  isLogin: z.string(), // "true" 表示登录，"false" 表示注册
  inviteCode: z.string().optional(),
});

export async function handleInternalAuth(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const validated = authSchema.safeParse(rawData);

  // 1. 数据合法性校验
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { username, password, role, isLogin, inviteCode } = validated.data;

  try {
    // --- 登录流程 ---
    if (isLogin === "true") {
      const user = await db.user.findUnique({ where: { username } });

      // 安全策略：不提示“用户不存在”，统一提示“无效”，防止暴力破解探测用户名
      if (!user || !user.isActive) {
        return { error: "用户名或密码无效" };
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return { error: "用户名或密码无效" };
      }

      // 登录成功
      if (isMatch) {
        // 登录成功，返回用户信息
        return {
          success: true,
          message: "登录成功，正在跳转...",
          role: user.role, // 确保返回角色字段
          username: user.username,
        };
      }
    }

    // --- 注册流程 ---
    else {
      // 内部软件邀请码校验
      if (inviteCode !== process.env.INTERNAL_INVITE_CODE) {
        return { error: "邀请码无效，请联系管理员获取" };
      }

      const existingUser = await db.user.findUnique({ where: { username } });
      if (existingUser) {
        return { error: "该用户名已被占用" };
      }

      // 12 轮哈希，兼顾安全与性能
      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = await db.user.create({
        data: {
          username,
          password: hashedPassword,
          role: role || "DISPATCHER", // 默认设为配货员
          isActive: true, // 内部软件可根据需求设为 false 待审核
        },
      });

      return { success: true, message: "注册成功，请切换至登录" };
    }
  } catch (error) {
    console.error("Auth Action Error:", error);
    return { error: "数据库连接异常，请检查配置" };
  }
}
