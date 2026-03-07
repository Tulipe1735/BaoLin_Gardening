"use client";

import React, { useState } from "react";
import { Camera, Loader2, Trash2, CheckCircle2, RotateCcw } from "lucide-react";
import {
  updateOrderImages,
  refreshAction,
  executeOrder,
} from "@/app/dashboard/actions";
import { isRedirectError } from "next/dist/client/components/redirect-error";

interface ImageUploadProps {
  orderId: string;
  currentImages: string[];
  role: string;
  username: string;
}

export default function ImageUpload({
  orderId,
  currentImages,
  role,
  username,
}: ImageUploadProps) {
  const [loading, setLoading] = useState(false);

  // 仅配货员 (DISPATCHER) 拥有操作权限
  const isDispatcher = role === "DISPATCHER";
  if (!isDispatcher) return null;

  // 1. 上传新图片 (Base64 处理)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        // 调用 action：将新图片追加到当前数组
        await updateOrderImages(
          orderId,
          [...currentImages, base64String],
          role,
          username,
        );
      } catch (err) {
        alert("上传失败，请检查网络");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // 2. 删除单张图片
  const handleDeleteImage = async (index: number) => {
    if (!confirm("确定删除这张图片吗？")) return;

    const updatedImages = currentImages.filter((_, i) => i !== index);
    try {
      await updateOrderImages(orderId, updatedImages, role, username);
    } catch (err) {
      alert("删除失败");
    }
  };

  // 3. 重新上传 (调用 refreshAction 清空图片)
  const handleReset = async () => {
    if (!confirm("警告：这将清空所有已上传的图片，确定重新上传吗？")) return;

    setLoading(true);
    try {
      await refreshAction(orderId, role, username);
    } catch (err) {
      alert("操作失败");
    } finally {
      setLoading(false);
    }
  };

  // 4. 执行订单 (归档)
  const handleExecute = async () => {
    if (currentImages.length === 0) {
      alert("请至少上传一张配货凭证照片再执行");
      return;
    }

    if (!confirm("执行后订单将进入历史记录，确认完成配货？")) return;

    setLoading(true);
    try {
      await executeOrder(orderId, role, username);
      // 注意：如果 executeOrder 成功触发了 redirect，代码将不会执行到这一行
    } catch (err) {
      // 关键修正：如果错误是由跳转引起的，直接抛出，不要拦截
      if (isRedirectError(err)) {
        throw err;
      }

      // 只有真正的数据库报错或网络报错才弹窗
      console.error("执行失败", err);
      alert("操作失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 space-y-6">
      {/* 图片预览与删除区 */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {currentImages.map((img, idx) => (
            <div key={idx} className="relative aspect-square group">
              <img
                src={img}
                alt="凭证"
                className="w-full h-full object-cover rounded-xl border border-slate-200"
              />
              <button
                onClick={() => handleDeleteImage(idx)}
                className="absolute top-2 right-2 p-1.5 bg-red-500/90 text-white rounded-full shadow-lg backdrop-blur-sm active:scale-90 transition-transform"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 操作按钮组 */}
      <div className="flex flex-col gap-3">
        {/* 上传主按钮 */}
        <label className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50">
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Camera size={20} />
          )}
          {loading ? "处理中..." : "继续上传照片"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={loading}
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          {/* 重新上传 (清空) */}
          <button
            onClick={handleReset}
            disabled={loading || currentImages.length === 0}
            className="flex items-center justify-center gap-2 py-3.5 border-2 border-slate-200 text-slate-600 rounded-2xl font-bold text-sm active:bg-slate-50 disabled:opacity-40 transition-colors"
          >
            <RotateCcw size={18} />
            清空重来
          </button>

          {/* 执行归档 */}
          <button
            onClick={handleExecute}
            disabled={loading || currentImages.length === 0}
            className="flex items-center justify-center gap-2 py-3.5 bg-green-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-green-100 active:scale-[0.98] disabled:opacity-40 transition-all"
          >
            <CheckCircle2 size={18} />
            确认执行
          </button>
        </div>
      </div>

      <p className="text-center text-[10px] text-slate-400">
        配货员：{username} · 当前订单：{orderId}
      </p>
    </div>
  );
}
