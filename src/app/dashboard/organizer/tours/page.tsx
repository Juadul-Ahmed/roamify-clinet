"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { TbPlus, TbEdit, TbTrash, TbMapPin } from "react-icons/tb";
import { EditTourModal } from "@/Components/Dashboard/EditTourModal";

interface Tour {
  _id: string;
  title: string;
  location: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  createdAt: string;
}

export default function MyToursPage() {
  const [mounted, setMounted] = useState(false);
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const fetchTours = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/tours?organizerId=${user.id}`
        );

        if (!res.ok) {
          throw new Error("Failed to load your tours.");
        }

        const data = await res.json();
        setTours(data.tours);
      } catch (err) {
        setError("Unable to load your tours right now. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTours();
  }, [user?.id]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tour? This cannot be undone.")) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tours/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete tour.");
      }

      setTours((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert("Could not delete this tour. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (!mounted || isPending) {
    return (
      <div>
        <div className="mb-8 h-8 w-48 animate-pulse rounded-xl bg-slate-100" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-3xl bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Tours</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage the tours you&apos;ve listed on Roamify.
          </p>
        </div>
        <Link
          href="/dashboard/organizer/tours/add"
          className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-600 transition-colors"
        >
          <TbPlus size={16} />
          Add Tour
        </Link>
      </div>

      {/* States */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-3xl bg-slate-100" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
          {error}
        </div>
      ) : tours.length === 0 ? (
        <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm">
          <p className="text-slate-500 text-sm mb-4">
            You haven&apos;t created any tours yet.
          </p>
          <Link
            href="/dashboard/organizer/tours/add"
            className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-600 transition-colors"
          >
            <TbPlus size={16} />
            Create Your First Tour
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => (
            <div
              key={tour._id}
              className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm"
            >
              <div className="relative h-40 w-full bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="h-full w-full object-cover"
                />
                <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 backdrop-blur-sm">
                  {tour.category}
                </span>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-1 text-xs text-slate-400 mb-1.5">
                  <TbMapPin size={12} />
                  {tour.location}
                </div>
                <h3 className="text-sm font-semibold text-slate-900 line-clamp-1">
                  {tour.title}
                </h3>
                <p className="mt-2 text-sm font-bold text-sky-600">
                  ${tour.price} <span className="text-xs font-normal text-slate-400">/ person</span>
                </p>

                <div className="mt-4 flex items-center gap-2 pt-3 border-t border-slate-100">
                  <EditTourModal
  tourId={tour._id}
  onUpdated={(updated) =>
    setTours((prev) => prev.map((t) => (t._id === updated._id ? updated : t)))
  }
/>
                  <button
                    onClick={() => handleDelete(tour._id)}
                    disabled={deletingId === tour._id}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-100 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <TbTrash size={14} />
                    {deletingId === tour._id ? "Deleting..." : "Delete"}
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