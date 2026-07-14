import { TbShieldCheck, TbUsersGroup, TbCoin, TbHeadset } from "react-icons/tb";

const features = [
  {
    icon: TbShieldCheck,
    title: "Verified Organizers",
    description: "Every tour is listed by a vetted organizer, so you know exactly who you're booking with.",
  },
  {
    icon: TbCoin,
    title: "Transparent Pricing",
    description: "No hidden fees. The price you see is the price you pay, per person, every time.",
  },
  {
    icon: TbUsersGroup,
    title: "Community Driven",
    description: "Real travelers, real reviews. Make decisions based on genuine experiences.",
  },
  {
    icon: TbHeadset,
    title: "Support When You Need It",
    description: "Our help center and support team are ready to assist before, during, and after your trip.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Why Choose Roamify</h2>
          <p className="mt-2 text-sm text-slate-500">
            Built for travelers who want it done right.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-500 mb-4">
                  <Icon size={22} />
                </div>
                <h3 className="text-base font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}