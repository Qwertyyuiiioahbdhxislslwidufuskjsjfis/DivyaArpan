import Link from "next/link";
import { ArrowRight, CheckCircle2, HeartHandshake, MapPinned } from "lucide-react";

const services = [
  {
    title: "Choose a temple",
    description: "Browse temple listings and open a temple to see its available poojas.",
    icon: MapPinned,
  },
  {
    title: "Select a pooja",
    description: "Review the pooja details, duration, and listed price before booking.",
    icon: CheckCircle2,
  },
  {
    title: "Sankalp / Mannat",
    description: "Include your prayer or intention while completing an existing Pooja booking.",
    icon: HeartHandshake,
  },
];

export default function HomeDevotionalServices() {
  return (
    <section className="bg-[#fffaf5] px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 rounded-[28px] border border-orange-100 bg-white p-7 shadow-sm md:p-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">
              Your intention matters
            </span>
            <h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-[#10264b] md:text-5xl">
              Make space for your Sankalp.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
              Add a personal prayer, Mannat or devotional intention to your Pooja
              booking. The existing booking form gives you a dedicated Sankalp field
              without requiring a separate request or payment.
            </p>
            <Link
              href="/booking?mode=ON_BEHALF"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#f45112] px-6 py-3.5 font-bold text-white transition hover:bg-[#e94b00]"
            >
              Begin a Pooja Booking
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="group rounded-2xl border border-orange-100 bg-[#fffaf5] p-5 transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-md"
                >
                  <Icon className="text-orange-600" size={26} />
                  <h3 className="mt-4 font-bold text-slate-900">{service.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
