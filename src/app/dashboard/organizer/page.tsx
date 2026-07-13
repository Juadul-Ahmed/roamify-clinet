"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { TbMap2, TbCalendarEvent, TbCoin, TbStar } from "react-icons/tb";
import StatCard from "@/Components/Dashboard/StatCard";
import StatCardSkeleton from "@/Components/Dashboard/StatCardSkeleton";

interface OrganizerStats {
  totalTours: number;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
}

interface Booking {
  _id: string;
  tourTitle: string;
  userName: string | null;
  guests: number;
  date: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
}

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-600",
  confirmed: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-slate-100 text-slate-500",
};

const OrganizerDashboardPage = () => {
  const [mounted, setMounted] = useState(false);
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [stats, setStats] = useState<OrganizerStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/organizer/stats?organizerId=${user.id}`
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setStats(data.stats);
      } catch {
        setStatsError("Unable to load stats right now.");
      } finally {
        setStatsLoading(false);
      }
    };

    const fetchRecentBookings = async () => {
      try {
        setBookingsLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/bookings?organizerId=${user.id}`
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setRecentBookings((data.bookings || []).slice(0, 5));
      } catch {
        setRecentBookings([]);
      } finally {
        setBookingsLoading(false);
      }
    };

    fetchStats();
    fetchRecentBookings();
  }, [user?.id]);

  const statCards = [
    {
      label: "Total Tours",
      value: statsLoading ? "—" : stats?.totalTours ?? 0,
      icon: TbMap2,
      color: "bg-sky-50 text-sky-600",
    },
    {
      label: "Total Bookings",
      value: statsLoading ? "—" : stats?.totalBookings ?? 0,
      icon: TbCalendarEvent,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Total Revenue",
      value: statsLoading ? "—" : `$${(stats?.totalRevenue ?? 0).toLocaleString()}`,
      icon: TbCoin,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Average Rating",
      value: statsLoading ? "—" : (stats?.averageRating ?? 0).toFixed(1),
      icon: TbStar,
      color: "bg-violet-50 text-violet-600",
    },
  ];

  if (!mounted || isPending) {
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

      {statsError && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
          {statsError}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="rounded-3xl border border-slate-100 bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900">Recent Bookings</h2>
        </div>

        {bookingsLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : recentBookings.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-400">
            No data yet. Once your tours start getting bookings, they&apos;ll show up here.
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {recentBookings.map((booking) => (
              <div key={booking._id} className="flex items-center justify-between gap-4 px-6 py-3.5">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{booking.tourTitle}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {booking.userName || "Unknown traveler"} • {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-semibold text-sky-600">${booking.totalPrice}</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[booking.status]}`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboardPage;