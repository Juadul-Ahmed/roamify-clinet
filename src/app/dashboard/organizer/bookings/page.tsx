"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { TbCalendar, TbUsers, TbCheck, TbX, TbSearch } from "react-icons/tb";
import { apiFetch } from "@/lib/api-client";

interface Booking {
  _id: string;
  tourId: string;
  tourTitle: string;
  tourImage: string;
  userName: string | null;
  userEmail: string | null;
  guests: number;
  date: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

const statusFilters = ["All", "pending", "confirmed", "cancelled"];

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-600",
  confirmed: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-slate-100 text-slate-500",
};

export default function OrganizerBookingsPage() {
  const [mounted, setMounted] = useState(false);
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const res = await apiFetch("/bookings");
        if (!res.ok) throw new Error("Failed to load bookings.");
        const data = await res.json();
        setBookings(data.bookings);
      } catch (err) {
        setError("Unable to load bookings right now.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [user?.id]);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const res = await apiFetch(`/bookings/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to update status.");
      }

      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: status as Booking["status"] } : b))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not update this booking. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === "All" || b.status === statusFilter;
    const matchesSearch =
      b.tourTitle.toLowerCase().includes(search.toLowerCase()) ||
      (b.userName || "").toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (!mounted || isPending) {
    return (
      <div>
        <div className="mb-8 h-8 w-48 animate-pulse rounded-xl bg-slate-100" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage bookings made on your tours.
        </p>
      </div>

      {/* Search + Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <TbSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by tour or traveler..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          />
        </div>
        <div className="flex gap-2">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-xl px-3.5 py-2.5 text-sm font-medium capitalize transition-colors ${
                statusFilter === s
                  ? "bg-sky-500 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
          {error}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm">
          <p className="text-slate-500 text-sm">No bookings match this filter yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <div className="h-16 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={booking.tourImage} alt={booking.tourTitle} className="h-full w-full object-cover" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-900 truncate">{booking.tourTitle}</h3>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[booking.status]}`}>
                    {booking.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {booking.userName || "Unknown traveler"} {booking.userEmail && `• ${booking.userEmail}`}
                </p>
                <div className="mt-1.5 flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <TbCalendar size={13} />
                    {new Date(booking.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1">
                    <TbUsers size={13} />
                    {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
                  </span>
                  <span className="font-semibold text-sky-600">${booking.totalPrice}</span>
                </div>
              </div>

              {booking.status === "pending" && (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleStatusChange(booking._id, "confirmed")}
                    disabled={updatingId === booking._id}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-600 transition-colors disabled:opacity-50"
                  >
                    <TbCheck size={14} />
                    Confirm
                  </button>
                  <button
                    onClick={() => handleStatusChange(booking._id, "cancelled")}
                    disabled={updatingId === booking._id}
                    className="flex items-center gap-1.5 rounded-xl border border-red-100 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <TbX size={14} />
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}