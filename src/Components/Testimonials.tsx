import { TbStar, TbQuote } from "react-icons/tb";

const testimonials = [
  {
    name: "Sarah Mitchell",
    trip: "Swiss Alps Cable Car Adventure",
    quote:
      "Booking was seamless and the organizer was incredibly responsive. The whole trip felt effortless from start to finish.",
    rating: 5,
  },
  {
    name: "James Okafor",
    trip: "Kyoto Temple & Tea Ceremony",
    quote:
      "Exactly as described, no surprises. Roamify made it easy to find something authentic instead of a typical tourist trap.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    trip: "Bali Jungle Waterfall Trek",
    quote:
      "Loved how transparent the pricing was. I knew exactly what I was paying for before I even booked.",
    rating: 4,
  },
];

export default function Testimonials() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">What Travelers Say</h2>
        <p className="mt-2 text-sm text-slate-500">Real experiences from real trips.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="relative rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
          >
            <TbQuote size={28} className="text-sky-100 mb-3" />
            <p className="text-sm text-slate-600 leading-relaxed">{t.quote}</p>

            <div className="mt-5 flex items-center justify-between border-t border-slate-50 pt-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                <p className="text-xs text-slate-400">{t.trip}</p>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <TbStar
                    key={i}
                    size={14}
                    className={i < t.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}