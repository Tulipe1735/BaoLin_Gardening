import { useFormStatus } from "react-dom";

// 独立的提交按钮组件，利用 useFormStatus 实现 Loading 状态
export function SubmitButton({ isLogin }: { isLogin: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full mt-6 flex justify-center items-center py-4 rounded-2xl bg-blue-600 text-white disabled:bg-slate-400"
    >
      {pending ? "处理中..." : isLogin ? "立即登录" : "提交注册"}
    </button>
  );
}
