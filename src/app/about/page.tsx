import Link from "next/link";
import { FiCompass, FiHeart, FiShield, FiUsers } from "react-icons/fi";
import { FaCompass } from "react-icons/fa";

const stats = [
  { label: "Tours listed", value: "1,200+" },
  { label: "Countries covered", value: "48" },
  { label: "Verified organizers", value: "300+" },
  { label: "Trips booked", value: "15k+" },
];

const values = [
  {
    icon: FiCompass,
    title: "Real local expertise",
    description:
      "Every tour on Roamify is run by an organizer who actually knows the ground — not a reseller. What you book is what you get.",
  },
  {
    icon: FiShield,
    title: "Trust, built in",
    description:
      "Organizer verification, transparent pricing, and clear booking status at every step, so there are no surprises on either side.",
  },
  {
    icon: FiUsers,
    title: "Built for both sides",
    description:
      "Travelers get curated, bookable experiences. Organizers get a dashboard that actually shows them what's happening with their tours.",
  },
  {
    icon: FiHeart,
    title: "Small enough to care",
    description:
      "We're not optimizing for scale at any cost. We're optimizing for trips that go well and organizers who want to come back.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500 text-white">
            <FaCompass size={28} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            We built Roamify because booking a tour
            <br className="hidden sm:block" /> shouldn&apos;t feel like a gamble.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-500">
            Roamify connects travelers with independent tour organizers directly —
            no middlemen marking things up, no guessing whether the listing is
            even real. Just people who know a place, and people who want to see it.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-100 bg-slate-50/60">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-extrabold text-slate-900">{stat.value}</div>
              <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            What we actually care about
          </h2>
          <p className="mt-3 text-sm text-slate-500">
            Not a mission statement for its own sake — this is what shapes every
            decision we make on the platform.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                <value.icon size={20} />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">
                {value.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-100 bg-slate-900">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 lg:flex-row lg:justify-between lg:text-left lg:px-8">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Ready to find your next trip?
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Browse tours from real organizers, or list your own if you're the
              one who knows the way.
            </p>
          </div>
          <div className="flex shrink-0 gap-3">
            <Link
              href="/explore"
              className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Explore Tours
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-600"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}