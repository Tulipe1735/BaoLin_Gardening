import { ArrowRight, Briefcase } from "lucide-react";

export default function RolePick() {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-2">
        岗位分配
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 pointer-events-none">
          <Briefcase size={18} />
        </div>
        <select
          name="role"
          className="block w-full pl-11 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none transition-all cursor-pointer"
        >
          <option value="DISPATCHER">仓储配货员 (Dispatcher)</option>
          <option value="CUSTOMER_SERVICE">客服专员 (Customer Service)</option>
        </select>
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
          <ArrowRight size={16} className="rotate-90" />
        </div>
      </div>
    </div>
  );
}
