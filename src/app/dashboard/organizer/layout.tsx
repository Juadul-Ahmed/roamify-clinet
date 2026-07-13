"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";


export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const role = (user as { role?: string } | undefined)?.role;

  useEffect(() => {
    if (isPending) return;

    if (!user || role !== "organizer") {
      router.replace("/unauthorized");
    }
  }, [isPending, user, role, router]);

  
  if (isPending || !user || role !== "organizer") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-sky-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}