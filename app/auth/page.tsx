"use client";

import React, { useState } from "react";
import { handleInternalAuth } from "./actions";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { SubmitButton } from "../components/submitbutton";
import Password from "../components/password";
import RolePick from "../components/rolepick";
import InviteCode from "../components/InviteCode";
import UserName from "../components/UserName";
import Logo from "../components/Logo";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    formData.append("isLogin", String(isLogin));

    try {
      const result = await handleInternalAuth(formData);

      if (!result) {
        alert("服务器未响应，请稍后再试");
        return;
      }

      if (result.error) {
        alert(result.error);
      } else {
        if (isLogin && result.success && result.role && result.username) {
          router.push(
            `/dashboard/orders?role=${result.role}&username=${result.username}`,
          );
        } else {
          alert("注册成功，请使用新账号登录");
          setIsLogin(true);
        }
      }
    } catch (err) {
      console.error(err);
      alert("网络连接失败，请检查数据库或环境变量配置");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center px-4 py-12 font-sans">
      {/* 顶部 Logo */}
      <Logo />

      {/* 登录/注册表单 */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-8 shadow-2xl rounded-[2.5rem] border border-slate-100">
          <form action={handleSubmit} className="space-y-5">
            {/* 用户名 */}
            <UserName />

            {/* 密码 */}
            <Password />

            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5 overflow-hidden"
                >
                  {/* 角色选择 */}
                  <RolePick />

                  {/* 邀请码 */}
                  <InviteCode isLogin={isLogin} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* 提交按钮 */}
            <SubmitButton isLogin={isLogin} />
          </form>

          {/* 切换登录注册 */}
          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              {isLogin ? "新员工入职？申请账号" : "已有权限账号？立即登录"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
