"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

// 表单校验规则
const authSchema = z.object({
  username: z.string().min(4, "用户名至少4位").max(20, "用户名太长了"),
  password: z.string().min(8, "密码至少8位").regex(/[0-9]/, "密码需包含数字"),
  role: z.enum(["CUSTOMER_SERVICE", "DISPATCHER"]).optional(),
  isLogin: z.string(),
  inviteCode: z.string().optional(),
});

export async function handleInternalAuth(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());

  const validated = authSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { username, password, role, isLogin, inviteCode } = validated.data;

  try {
    // 登录
    if (isLogin === "true") {
      const user = await db.user.findUnique({ where: { username } });
      if (!user || !user.isActive) return { error: "用户名或密码无效" };

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return { error: "用户名或密码无效" };

      return {
        success: true,
        role: user.role,
        username: user.username,
      };
    }

    // 注册
    if (inviteCode !== process.env.INTERNAL_INVITE_CODE) {
      return { error: "邀请码无效，请联系管理员获取" };
    }

    const existingUser = await db.user.findUnique({ where: { username } });
    if (existingUser) return { error: "该用户名已被占用" };

    const hashedPassword = await bcrypt.hash(password, 12);
    await db.user.create({
      data: {
        username,
        password: hashedPassword,
        role: role,
        isActive: true,
      },
    });

    return { success: true, message: "注册成功，请使用新账号登录" };
  } catch (error) {
    console.error("Auth Action Error:", error);
    return { error: "服务器异常，请检查数据库连接" };
  }
}
