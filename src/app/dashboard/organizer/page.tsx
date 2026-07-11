"use client";

import { useSession } from "@/lib/auth-client";
import { TbMap2, TbCalendarEvent, TbCoin, TbStar } from "react-icons/tb";
import StatCard from "@/Components/Dashboard/StatCard";
import StatCardSkeleton from "@/Components/Dashboard/StatCardSkeleton";

const OrganizerDashboardPage = () => {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const statCards = [
    { label: "Total Tours", value: "—", icon: TbMap2, color: "bg-sky-50 text-sky-600" },
    { label: "Total Bookings", value: "—", icon: TbCalendarEvent, color: "bg-emerald-50 text-emerald-600" },
    { label: "Total Revenue", value: "—", icon: TbCoin, color: "bg-amber-50 text-amber-600" },
    { label: "Average Rating", value: "—", icon: TbStar, color: "bg-violet-50 text-violet-600" },
  ];

  if (isPending) {
    return (
      <div>
        <div className="mb-8 h-8 w-64 animate-pulse rounded-xl bg-slate-100" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {user?.name ?? "Organizer"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Here&apos;s a quick look at your tours and bookings.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Empty State for Recent Activity */}
      <div className="rounded-3xl border border-slate-100 bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900">Recent Bookings</h2>
        </div>
        <div className="p-10 text-center text-sm text-slate-400">
          No data yet. Once your tours start getting bookings, they&apos;ll show up here.
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboardPage;