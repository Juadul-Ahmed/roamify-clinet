"use client";

import { useEffect, useState } from "react";
import { TbSearch, TbTrash, TbUserCircle } from "react-icons/tb";
import { apiFetch } from "@/lib/api-client";

interface AppUser {
  _id: string;
  name: string;
  email: string;
  role: "traveler" | "organizer" | "admin";
  createdAt: string;
  emailVerified: boolean;
}

const roleFilters = ["All", "traveler", "organizer", "admin"];

const roleBadgeStyles: Record<string, string> = {
  traveler: "bg-sky-50 text-sky-600",
  organizer: "bg-violet-50 text-violet-600",
  admin: "bg-amber-50 text-amber-600",
};

export default function ManageUsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (roleFilter !== "All") params.set("role", roleFilter);

      const res = await apiFetch(`/admin/users?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load users.");
      const data = await res.json();
      setUsers(data.users);
    } catch (err) {
      setError("Unable to load users right now.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(fetchUsers, 300); // debounce search typing
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, roleFilter]);

  const handleRoleChange = async (id: string, newRole: string) => {
    setUpdatingId(id);
    try {
      const res = await apiFetch(`/admin/users/${id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to update role.");
      }

      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: newRole as AppUser["role"] } : u))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not update this user's role. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user account? This cannot be undone.")) return;

    setDeletingId(id);
    try {
      const res = await apiFetch(`/admin/users/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to delete user.");
      }

      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not delete this user. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Manage Users</h1>
        <p className="mt-1 text-sm text-slate-500">
          View and manage every account on the platform.
        </p>
      </div>

      {/* Search + Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <TbSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          />
        </div>
        <div className="flex gap-2">
          {roleFilters.map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`rounded-xl px-3.5 py-2.5 text-sm font-medium capitalize transition-colors ${
                roleFilter === r
                  ? "bg-sky-500 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : error ? (
          <div className="p-6 text-sm font-medium text-red-600">{error}</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-400">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-medium text-slate-400">
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Joined</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-slate-50 last:border-0">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <TbUserCircle size={22} className="text-slate-300" />
                        <span className="font-medium text-slate-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-slate-500">{u.email}</td>
                    <td className="px-6 py-3.5">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        disabled={updatingId === u._id}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium border-0 capitalize cursor-pointer disabled:opacity-50 ${
                          roleBadgeStyles[u.role] || "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <option value="traveler">Traveler</option>
                        <option value="organizer">Organizer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-3.5 text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => handleDelete(u._id)}
                        disabled={deletingId === u._id}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <TbTrash size={14} />
                        {deletingId === u._id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}