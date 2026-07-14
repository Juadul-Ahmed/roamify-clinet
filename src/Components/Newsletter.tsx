"use client";

import { useState } from "react";
import { TbMail, TbSend, TbCircleCheck } from "react-icons/tb";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);


    await new Promise((resolve) => setTimeout(resolve, 600));

    setIsSubmitting(false);
    setIsSubscribed(true);
    setEmail("");
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-12 sm:px-16 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.2),transparent_50%)]" />

        <div className="relative z-10">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400">
            <TbMail size={22} />
          </div>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Never Miss a Trip</h2>
          <p className="mt-2 text-sm text-slate-300 max-w-md mx-auto">
            Get new tours, travel tips, and exclusive deals delivered straight to your inbox.
          </p>

          {isSubscribed ? (
            <div className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-emerald-400">
              <TbCircleCheck size={18} />
              You're subscribed! Check your inbox soon.
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border-0 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-600 transition-colors disabled:opacity-60 whitespace-nowrap"
              >
                {isSubmitting ? "Subscribing..." : (
                  <>
                    Subscribe
                    <TbSend size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
        </div>
      </div>
    </section>
  );
}