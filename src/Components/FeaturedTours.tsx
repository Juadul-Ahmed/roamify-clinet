"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TbMapPin, TbStar, TbArrowRight } from "react-icons/tb";

interface Tour {
  _id: string;
  title: string;
  location: string;
  price: number;
  category: string;
  image: string;
  rating: number;
}

export default function FeaturedTours() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tours?limit=3`);
        if (!res.ok) return;
        const data = await res.json();
        setTours(data.tours || []);
      } catch {
        setTours([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Featured Tours</h2>
          <p className="mt-2 text-sm text-slate-500">Hand-picked adventures to get you started.</p>
        </div>
        <Link
          href="/explore"
          className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors"
        >
          View All
          <TbArrowRight size={16} />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-3xl bg-slate-100" />
          ))}
        </div>
      ) : tours.length === 0 ? (
        <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm">
          <p className="text-slate-500 text-sm">No tours available yet. Check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => (
            <div
              key={tour._id}
              className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 w-full bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={tour.image} alt={tour.title} className="h-full w-full object-cover" />
                <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 backdrop-blur-sm">
                  {tour.category}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1 text-xs text-slate-400 mb-1.5">
                  <TbMapPin size={12} />
                  {tour.location}
                </div>
                <h3 className="text-base font-semibold text-slate-900 line-clamp-1">{tour.title}</h3>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm font-bold text-sky-600">
                    ${tour.price} <span className="text-xs font-normal text-slate-400">/ person</span>
                  </p>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <TbStar size={14} className="text-amber-400" />
                    {tour.rating || "New"}
                  </div>
                </div>
                <Link
                  href={`/tours/${tour._id}/book`}
                  className="mt-4 flex items-center justify-center rounded-xl bg-sky-500 py-2.5 text-sm font-semibold text-white hover:bg-sky-600 transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center sm:hidden">
        <Link
          href="/explore"
          className="flex items-center gap-1.5 text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors"
        >
          View All Tours
          <TbArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}