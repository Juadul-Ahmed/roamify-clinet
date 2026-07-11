"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TbMapPin, TbLoader2, TbCircleCheck } from "react-icons/tb";
import { useSession } from "@/lib/auth-client";

interface Tour {
  _id: string;
  title: string;
  location: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

export default function BookTourPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();
  const user = session?.user;

  const [tour, setTour] = useState<Tour | null>(null);
  const [isLoadingTour, setIsLoadingTour] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("1");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tours/${id}`);

        if (!res.ok) {
          throw new Error("This tour could not be found.");
        }

        const data = await res.json();
        setTour(data.tour);
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setIsLoadingTour(false);
      }
    };

    fetchTour();
  }, [id]);

  const guestCount = Math.max(1, Number(guests) || 1);
  const total = tour ? tour.price * guestCount : 0;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    if (!user) {
      setSubmitError("Please log in to book this tour.");
      return;
    }

    if (!date) {
      setSubmitError("Please choose a date for your tour.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          tourId: id,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          guests: guestCount,
          date,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create your booking.");
      }

      setIsBooked(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingTour || sessionLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 h-96 animate-pulse rounded-3xl bg-slate-100" />
        <div className="lg:col-span-2 h-96 animate-pulse rounded-3xl bg-slate-100" />
      </div>
    );
  }

  if (loadError || !tour) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
          {loadError || "This tour could not be found."}
        </div>
      </div>
    );
  }

  if (isBooked) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <TbCircleCheck size={48} className="mx-auto text-emerald-500 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900">Booking Confirmed</h1>
        <p className="mt-2 text-sm text-slate-500">
          Your spot on &quot;{tour.title}&quot; for {guestCount} {guestCount === 1 ? "guest" : "guests"} on{" "}
          {new Date(date).toLocaleDateString()} is reserved.
        </p>
        <button
          onClick={() => router.push("/explore")}
          className="mt-6 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-600 transition-colors"
        >
          Back to Explore
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Left column — tour summary */}
        <div className="lg:col-span-3 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          <div className="h-64 w-full bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={tour.image} alt={tour.title} className="h-full w-full object-cover" />
          </div>
          <div className="p-6">
            <div className="flex items-center gap-1 text-xs text-slate-400 mb-1.5">
              <TbMapPin size={12} />
              {tour.location}
            </div>
            <h1 className="text-xl font-bold text-slate-900">{tour.title}</h1>
            <p className="mt-2 text-sm text-slate-500">{tour.description}</p>
            <p className="mt-3 text-sm font-bold text-sky-600">
              ${tour.price} <span className="text-xs font-normal text-slate-400">/ person</span>
            </p>
          </div>
        </div>

        {/* Right column — booking form */}
        <form
          onSubmit={onSubmit}
          className="lg:col-span-2 rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm space-y-6 lg:sticky lg:top-8"
        >
          <h2 className="text-lg font-bold text-slate-900">Book This Tour</h2>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Tour Date</label>
            <input
              required
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Number of Guests</label>
            <input
              required
              type="number"
              min="1"
              step="1"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 flex items-center justify-between">
            <span className="text-sm text-slate-500">Total</span>
            <span className="text-lg font-bold text-slate-900">${total}</span>
          </div>

          {submitError && (
            <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-medium text-red-600">
              {submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-600 transition-colors disabled:opacity-60"
          >
            {isSubmitting && <TbLoader2 size={16} className="animate-spin" />}
            {isSubmitting ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
}