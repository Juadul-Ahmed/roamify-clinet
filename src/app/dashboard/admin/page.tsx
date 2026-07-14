"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { TbUsers, TbBriefcase, TbMap2, TbCoin, TbTicket } from "react-icons/tb";
import StatCard from "@/Components/Dashboard/StatCard";
import StatCardSkeleton from "@/Components/Dashboard/StatCardSkeleton";
import { apiFetch } from "@/lib/api-client";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface AdminStats {
  totalUsers: number;
  totalOrganizers: number;
  totalTravelers: number;
  totalTours: number;
  totalBookings: number;
  totalRevenue: number;
}

interface DayCount {
  _id: string;
  count?: number;
  revenue?: number;
}

interface BreakdownItem {
  _id: string;
  count: number;
}

const ROLE_COLORS: Record<string, string> = {
  traveler: "#0ea5e9",
  organizer: "#8b5cf6",
  admin: "#f59e0b",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#10b981",
  cancelled: "#94a3b8",
};

export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [signupsByDay, setSignupsByDay] = useState<DayCount[]>([]);
  const [revenueByDay, setRevenueByDay] = useState<DayCount[]>([]);
  const [roleDistribution, setRoleDistribution] = useState<BreakdownItem[]>([]);
  const [bookingStatusBreakdown, setBookingStatusBreakdown] = useState<BreakdownItem[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const res = await apiFetch("/admin/stats");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setStats(data.stats);
      } catch {
        setStats(null);
      } finally {
        setStatsLoading(false);
      }
    };

    const fetchAnalytics = async () => {
      try {
        setAnalyticsLoading(true);
        const res = await apiFetch("/admin/analytics");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setSignupsByDay(data.signupsByDay || []);
        setRevenueByDay(data.revenueByDay || []);
        setRoleDistribution(data.roleDistribution || []);
        setBookingStatusBreakdown(data.bookingStatusBreakdown || []);
      } catch {
        // leave charts empty on failure
      } finally {
        setAnalyticsLoading(false);
      }
    };

    fetchStats();
    fetchAnalytics();
  }, []);

  const statCards = [
    { label: "Total Users", value: statsLoading ? "—" : stats?.totalUsers ?? 0, icon: TbUsers, color: "bg-sky-50 text-sky-600" },
    { label: "Organizers", value: statsLoading ? "—" : stats?.totalOrganizers ?? 0, icon: TbBriefcase, color: "bg-violet-50 text-violet-600" },
    { label: "Total Tours", value: statsLoading ? "—" : stats?.totalTours ?? 0, icon: TbMap2, color: "bg-emerald-50 text-emerald-600" },
    { label: "Total Bookings", value: statsLoading ? "—" : stats?.totalBookings ?? 0, icon: TbTicket, color: "bg-amber-50 text-amber-600" },
    { label: "Platform Revenue", value: statsLoading ? "—" : `$${(stats?.totalRevenue ?? 0).toLocaleString()}`, icon: TbCoin, color: "bg-rose-50 text-rose-600" },
  ];

  const formatDayLabel = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric" });

  if (!mounted || isPending) {
    return (
      <div>
        <div className="mb-8 h-8 w-64 animate-pulse rounded-xl bg-slate-100" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
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
          Welcome back, {user?.name ?? "Admin"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Platform-wide overview across all users, tours, and bookings.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-10">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Charts Row 1: Signups + Revenue over time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-slate-900">New Signups (Last 30 Days)</h2>
          {analyticsLoading ? (
            <div className="h-64 animate-pulse rounded-xl bg-slate-100" />
          ) : signupsByDay.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-sm text-slate-400">
              No signup data yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={signupsByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="_id"
                  tickFormatter={formatDayLabel}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  labelFormatter={(label) => formatDayLabel(label as string)}
                  contentStyle={{ borderRadius: 12, border: "1px solid #f1f5f9", fontSize: 12 }}
                />
                <Line type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-slate-900">Revenue (Last 30 Days)</h2>
          {analyticsLoading ? (
            <div className="h-64 animate-pulse rounded-xl bg-slate-100" />
          ) : revenueByDay.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-sm text-slate-400">
              No revenue data yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={revenueByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="_id"
                  tickFormatter={formatDayLabel}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  labelFormatter={(label) => formatDayLabel(label as string)}
                  formatter={(value: number) => [`$${value}`, "Revenue"]}
                  contentStyle={{ borderRadius: 12, border: "1px solid #f1f5f9", fontSize: 12 }}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Charts Row 2: Role distribution + Booking status breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-slate-900">User Roles</h2>
          {analyticsLoading ? (
            <div className="h-56 animate-pulse rounded-xl bg-slate-100" />
          ) : roleDistribution.length === 0 ? (
            <div className="flex h-56 items-center justify-center text-sm text-slate-400">
              No user data yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={roleDistribution}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {roleDistribution.map((entry) => (
                    <Cell key={entry._id} fill={ROLE_COLORS[entry._id] || "#cbd5e1"} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #f1f5f9", fontSize: 12 }} />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: 12, textTransform: "capitalize" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-slate-900">Booking Status</h2>
          {analyticsLoading ? (
            <div className="h-56 animate-pulse rounded-xl bg-slate-100" />
          ) : bookingStatusBreakdown.length === 0 ? (
            <div className="flex h-56 items-center justify-center text-sm text-slate-400">
              No bookings yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={bookingStatusBreakdown}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {bookingStatusBreakdown.map((entry) => (
                    <Cell key={entry._id} fill={STATUS_COLORS[entry._id] || "#cbd5e1"} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #f1f5f9", fontSize: 12 }} />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: 12, textTransform: "capitalize" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}