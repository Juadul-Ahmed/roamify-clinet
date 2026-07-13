import Link from "next/link";
import { TbLock, TbHome } from "react-icons/tb";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <TbLock size={28} className="text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
        <p className="mt-2 text-sm text-slate-500">
          You don&apos;t have permission to view this page. If you think this is a mistake,
          please contact support.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-600 transition-colors"
        >
          <TbHome size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}