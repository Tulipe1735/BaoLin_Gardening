import { Key } from "lucide-react";

interface InviteCodeProps {
  isLogin: boolean; // 父组件传进来的状态
}

export default function InviteCode({ isLogin }: InviteCodeProps) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-2">
        注册邀请码
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 pointer-events-none">
          <Key size={18} />
        </div>
        <input
          name="inviteCode"
          required={!isLogin}
          className="block w-full pl-11 pr-4 py-4 bg-blue-50/50 border border-blue-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          placeholder="请输入内部校验码"
        />
      </div>
    </div>
  );
}
