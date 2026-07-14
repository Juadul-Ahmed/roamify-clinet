"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TbCalendar, TbUsers, TbTrash, TbMapPin, TbTicket } from "react-icons/tb";
import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api-client";

interface Booking {
  _id: string;
  tourId: string;
  tourTitle: string;
  tourImage: string;
  guests: number;
  date: string;
  pricePerPerson: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export default function MyBookingsPage() {
  const { data: session, isPending: sessionLoading } = useSession();
  const user = session?.user;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (sessionLoading) return;

    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const res = await apiFetch("/bookings");

        if (!res.ok) {
          throw new Error("Failed to load your bookings.");
        }

        const data = await res.json();
        setBookings(data.bookings);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [user?.id, sessionLoading]);

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this booking? This cannot be undone.")) return;

    setCancellingId(id);
    try {
      const res = await apiFetch(`/bookings/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to cancel booking.");
      }

      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert("Could not cancel this booking. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  if (sessionLoading || isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8 h-8 w-48 animate-pulse rounded-xl bg-slate-100" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-3xl bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm">
          <p className="text-slate-500 text-sm">Please log in to see your bookings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
        <p className="mt-1 text-sm text-slate-500">Tours you&apos;ve reserved on Roamify.</p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
          {error}
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sky-50">
            <TbTicket size={26} className="text-sky-400" />
          </div>
          <p className="text-slate-500 text-sm mb-4">You haven&apos;t booked any tours yet.</p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-600 transition-colors"
          >
            Explore Tours
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="flex flex-col sm:flex-row gap-5 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="relative h-36 w-full sm:w-48 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={booking.tourImage}
                  alt={booking.tourTitle}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <span
                  className={`absolute top-2.5 left-2.5 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm ${
                    booking.status === "confirmed"
                      ? "bg-emerald-500/90 text-white"
                      : booking.status === "cancelled"
                      ? "bg-slate-500/90 text-white"
                      : "bg-amber-500/90 text-white"
                  }`}
                >
                  {booking.status}
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-between py-1">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{booking.tourTitle}</h3>

                  <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                    <span className="flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                      <TbCalendar size={14} className="text-slate-400" />
                      {new Date(booking.date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                      <TbUsers size={14} className="text-slate-400" />
                      {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3">
                  <div>
                    <p className="text-xs text-slate-400">Total Price</p>
                    <p className="text-lg font-bold text-sky-600">${booking.totalPrice}</p>
                  </div>
                  <button
                    onClick={() => handleCancel(booking._id)}
                    disabled={cancellingId === booking._id || booking.status === "cancelled"}
                    className="flex items-center gap-1.5 rounded-xl border border-red-100 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <TbTrash size={14} />
                    {cancellingId === booking._id ? "Cancelling..." : "Cancel"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}