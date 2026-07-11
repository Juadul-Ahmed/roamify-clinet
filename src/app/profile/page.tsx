"use client";

import { useEffect, useState } from "react";
import { TbUser, TbMail, TbLoader2, TbCircleCheck, TbCompass, TbCalendarStats } from "react-icons/tb";
import { useSession, authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const { data: session, isPending: sessionLoading, refetch } = useSession();
  const user = session?.user;

  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  const isDirty = user?.name !== undefined && name.trim() !== user.name && name.trim().length > 0;

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })
    : null;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSaved(false);

    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    setIsSaving(true);
    try {
      const { error: updateError } = await authClient.updateUser({ name: name.trim() });

      if (updateError) {
        throw new Error(updateError.message || "Failed to update profile.");
      }

      await refetch();
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };

  if (sessionLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="h-28 animate-pulse rounded-t-3xl bg-slate-100" />
        <div className="h-72 animate-pulse rounded-b-3xl bg-slate-50" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm">
          <p className="text-slate-500 text-sm">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your account details.</p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
        {/* Passport-style header */}
        <div className="relative h-32 bg-gradient-to-br from-sky-500 via-sky-400 to-indigo-500">
          <svg
            className="absolute inset-0 h-full w-full opacity-20"
            viewBox="0 0 400 100"
            preserveAspectRatio="none"
          >
            <path
              d="M0 70 Q 100 40 200 65 T 400 55 V100 H0 Z"
              fill="white"
            />
          </svg>
          <TbCompass className="absolute right-5 top-5 text-white/30" size={40} />
        </div>

        <div className="px-8 sm:px-10">
          {/* Avatar overlaps the header */}
          <div className="mt-1">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-2xl font-bold text-white ring-4 ring-white shadow-md">
              {user.name?.charAt(0).toUpperCase() || "?"}
            </div>
            {memberSince && (
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
                <TbCalendarStats size={14} />
                Traveler since {memberSince}
              </div>
            )}
          </div>

          <div className="mt-4 mb-6">
            <p className="text-lg font-bold text-slate-900">{user.name}</p>
            <p className="flex items-center gap-1.5 text-sm text-slate-500">
              <TbMail size={14} />
              {user.email}
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4 border-t border-slate-100 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Name</label>
                <div className="relative">
                  <TbUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm transition-colors focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Email</label>
                <input
                  value={user.email ?? ""}
                  disabled
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-400"
                />
              </div>
            </div>
            <p className="text-xs text-slate-400">Email cannot be changed here.</p>

            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-medium text-red-600 animate-[fadeIn_0.2s_ease-out]">
                {error}
              </div>
            )}

            {saved && !error && (
              <div className="flex items-center gap-1.5 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-xs font-medium text-emerald-600 animate-[fadeIn_0.2s_ease-out]">
                <TbCircleCheck size={14} />
                Profile updated.
              </div>
            )}

            <button
              type="submit"
              disabled={isSaving || !isDirty}
              className="flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-sky-600 hover:shadow-md disabled:opacity-40 disabled:hover:shadow-none"
            >
              {isSaving && <TbLoader2 size={16} className="animate-spin" />}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}