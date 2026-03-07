import Image from "next/image";

export default function Logo() {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-blue-200 text-white shadow-xl mb-4">
        <Image src="/logo.svg" alt="Baolin Garden" width={40} height={40} />
      </div>
      <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
        宝林园艺
      </h2>
      <p className="mt-2 text-sm text-slate-500 italic">
        Internal Management Only
      </p>
    </div>
  );
}
