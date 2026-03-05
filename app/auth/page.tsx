"use client";

import React, { useState } from "react";
import {
  Lock,
  User,
  Key,
  ArrowRight,
  ShieldCheck,
  Briefcase,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { handleInternalAuth } from "./actions";
import { useRouter } from "next/navigation";

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
        if (isLogin && result.success) {
          if (result.role === "CUSTOMER_SERVICE") {
            router.push("/dashboard/customer-service");
          } else if (result.role === "DISPATCHER") {
            router.push("/dashboard/dispatcher");
          }
        } else {
          alert("注册成功，请登录");
          setIsLogin(true);
        }
      }
    } catch (err) {
      alert("网络连接失败，请检查您的网络");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center px-6 py-12 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-8 shadow-2xl rounded-[2.5rem] border border-slate-100">
          <form action={handleSubmit} className="space-y-5">
            {/* 用户名 */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-2">
                用户名
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                  <User size={18} />
                </div>
                <input
                  name="username"
                  required
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="输入用户名"
                />
              </div>
            </div>

            {/* 密码 */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-2">
                密码
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="输入密码"
                />
              </div>
            </div>

            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-5 overflow-hidden"
                >
                  {/* 角色 */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-2">
                      所属岗位
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                        <Briefcase size={18} />
                      </div>

                      <select
                        name="role"
                        className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                      >
                        <option value="DISPATCHER">配货员 (Dispatcher)</option>
                        <option value="CUSTOMER_SERVICE">
                          客服 (Customer Service)
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* 邀请码 */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-2">
                      邀请码
                    </label>

                    <input
                      name="inviteCode"
                      required
                      className="block w-full px-4 py-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="输入内部邀请码"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-4 rounded-2xl bg-indigo-600 text-white font-bold disabled:bg-slate-300"
            >
              {loading ? "提交中..." : isLogin ? "登录" : "注册"}
            </button>
          </form>

          {/* 切换登录注册 */}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="w-full mt-6 text-sm text-indigo-600 font-semibold text-center"
          >
            {isLogin ? "申请注册" : "返回登录"}
          </button>
        </div>
      </div>
    </div>
  );
}
