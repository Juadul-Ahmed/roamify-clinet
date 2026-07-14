import Link from "next/link";
import { TbCompassOff, TbHome, TbSearch } from "react-icons/tb";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-sky-50">
          <TbCompassOff size={36} className="text-sky-400" />
        </div>

        <p className="text-sm font-semibold text-sky-500 mb-2">404</p>
        <h1 className="text-2xl font-bold text-slate-900">Page Not Found</h1>
        <p className="mt-2 text-sm text-slate-500">
          Looks like this path doesn&apos;t exist. It may have been moved,
          removed, or you might have mistyped the address.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-600 transition-colors"
          >
            <TbHome size={16} />
            Back to Home
          </Link>
          <Link
            href="/explore"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <TbSearch size={16} />
            Explore Tours
          </Link>
        </div>
      </div>
    </div>
  );
}