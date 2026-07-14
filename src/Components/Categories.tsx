import Link from "next/link";
import { TbMountain, TbBeach, TbBuildingSkyscraper,  TbTent, TbLabel } from "react-icons/tb";

const categories = [
  { name: "Adventure", icon: TbTent, color: "bg-emerald-50 text-emerald-600" },
  { name: "Beach", icon: TbBeach, color: "bg-sky-50 text-sky-600" },
  { name: "Mountain", icon: TbMountain, color: "bg-violet-50 text-violet-600" },
  { name: "Cultural", icon: TbLabel, color: "bg-amber-50 text-amber-600" },
  { name: "City", icon: TbBuildingSkyscraper, color: "bg-rose-50 text-rose-600" },
];

export default function Categories() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Browse by Category</h2>
        <p className="mt-2 text-sm text-slate-500">
          Find the kind of adventure that suits you best.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.name}
              href={`/explore?category=${cat.name}`}
              className="group flex flex-col items-center gap-3 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${cat.color}`}>
                <Icon size={26} />
              </div>
              <span className="text-sm font-semibold text-slate-700 group-hover:text-sky-600 transition-colors">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}