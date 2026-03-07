import { Lock } from "lucide-react";

export default function Password() {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-2">
        密码
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 pointer-events-none">
          <Lock size={18} />
        </div>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          placeholder="请输入密码"
        />
      </div>
    </div>
  );
}
