import { User } from "lucide-react";

export default function UserName() {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-2">
        用户名
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 pointer-events-none">
          <User size={18} />
        </div>
        <input
          name="username"
          required
          autoComplete="username"
          className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          placeholder="输入用户名"
        />
      </div>
    </div>
  );
}
