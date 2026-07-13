"use client";

import { useEffect, useState } from "react";
import { TbSearch, TbTrash, TbEdit, TbX } from "react-icons/tb";

interface Tour {
  _id: string;
  title: string;
  location: string;
  price: number;
  category: string;
  image: string;
  description: string;
  organizerName: string;
  rating: number;
  createdAt: string;
}

const categories = ["Adventure", "Beach", "Mountain", "Cultural", "City"];

export default function ManageToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const fetchTours = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tours?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load tours.");
      const data = await res.json();
      setTours(data.tours);
    } catch (err) {
      setError("Unable to load tours right now.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(fetchTours, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this tour? This cannot be undone.")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tours/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete tour.");

      setTours((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert("Could not delete this tour. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTour) return;

    setIsSaving(true);
    setEditError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tours/${editingTour._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingTour.title,
          location: editingTour.location,
          price: Number(editingTour.price),
          category: editingTour.category,
          description: editingTour.description,
          image: editingTour.image,
        }),
      });

      if (!res.ok) throw new Error("Failed to update tour.");

      const data = await res.json();
      setTours((prev) => prev.map((t) => (t._id === editingTour._id ? data.tour : t)));
      setEditingTour(null);
    } catch (err) {
      setEditError("Could not save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Manage Tours</h1>
        <p className="mt-1 text-sm text-slate-500">
          View, edit, or remove any tour listed on the platform.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6 relative max-w-sm">
        <TbSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or location..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
        />
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : error ? (
          <div className="p-6 text-sm font-medium text-red-600">{error}</div>
        ) : tours.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-400">No tours found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-medium text-slate-400">
                  <th className="px-6 py-3">Tour</th>
                  <th className="px-6 py-3">Organizer</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tours.map((tour) => (
                  <tr key={tour._id} className="border-b border-slate-50 last:border-0">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={tour.image}
                          alt={tour.title}
                          className="h-10 w-14 rounded-lg object-cover bg-slate-100"
                        />
                        <div>
                          <p className="font-medium text-slate-900 line-clamp-1">{tour.title}</p>
                          <p className="text-xs text-slate-400">{tour.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-slate-500">{tour.organizerName || "—"}</td>
                    <td className="px-6 py-3.5">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {tour.category}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-medium text-sky-600">${tour.price}</td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingTour(tour)}
                          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <TbEdit size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(tour._id)}
                          disabled={deletingId === tour._id}
                          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          <TbTrash size={14} />
                          {deletingId === tour._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingTour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Edit Tour</h2>
              <button
                onClick={() => setEditingTour(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700"
              >
                <TbX size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Title</label>
                <input
                  required
                  value={editingTour.title}
                  onChange={(e) => setEditingTour({ ...editingTour, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Location</label>
                  <input
                    required
                    value={editingTour.location}
                    onChange={(e) => setEditingTour({ ...editingTour, location: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Category</label>
                  <select
                    value={editingTour.category}
                    onChange={(e) => setEditingTour({ ...editingTour, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Price per Person ($)</label>
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={editingTour.price}
                  onChange={(e) => setEditingTour({ ...editingTour, price: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Image URL</label>
                <input
                  required
                  value={editingTour.image}
                  onChange={(e) => setEditingTour({ ...editingTour, image: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Description</label>
                <textarea
                  required
                  rows={3}
                  value={editingTour.description}
                  onChange={(e) => setEditingTour({ ...editingTour, description: e.target.value })}
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>

              {editError && (
                <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-medium text-red-600">
                  {editError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTour(null)}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}