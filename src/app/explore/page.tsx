"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TbSearch, TbMapPin, TbStar } from "react-icons/tb";

interface Tour {
  _id: string;
  title: string;
  location: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: number;
}

const categories = ["All", "Adventure", "Beach", "Mountain", "Cultural", "City"];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
] as const;

type SortValue = (typeof sortOptions)[number]["value"];

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<SortValue>("newest");

  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce the search input so we're not firing a request on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchTours = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const query = new URLSearchParams();
        if (debouncedSearch) query.set("search", debouncedSearch);
        if (category !== "All") query.set("category", category);
        if (sort !== "newest") query.set("sort", sort);

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tours?${query.toString()}`);

        if (!res.ok) {
          throw new Error("Unable to load tours right now.");
        }

        const data = await res.json();
        setTours(data.tours);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load tours right now.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTours();
  }, [debouncedSearch, category, sort]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Explore Tours</h1>
        <p className="mt-1 text-sm text-slate-500">
          Discover tours from organizers around the world.
        </p>
      </div>

      {/* Controls */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <TbSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or location..."
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortValue)}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-3xl bg-slate-100" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
          {error}
        </div>
      ) : tours.length === 0 ? (
        <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm">
          <p className="text-slate-500 text-sm">
            No tours match your search. Try a different keyword or category.
          </p>
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
                <img src={tour.image} alt={tour.title} className="h-full w-full object-cover" />
                <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 backdrop-blur-sm">
                  {tour.category}
                </span>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-1 text-xs text-slate-400 mb-1.5">
                  <TbMapPin size={12} />
                  {tour.location}
                </div>
                <h3 className="text-sm font-semibold text-slate-900 line-clamp-1">{tour.title}</h3>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">{tour.description}</p>

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm font-bold text-sky-600">
                    ${tour.price} <span className="text-xs font-normal text-slate-400">/ person</span>
                  </p>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <TbStar size={14} className="text-amber-400" />
                    {tour.rating || "New"}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                
                  <Link
                    href={`/tours/${tour._id}/book`}
                    className="flex flex-1 items-center justify-center rounded-xl bg-sky-500 py-2.5 text-sm font-semibold text-white hover:bg-sky-600 transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}