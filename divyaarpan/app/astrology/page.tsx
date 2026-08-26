import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  HeartHandshake,
  Sparkles,
  Star,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";

const services = [
  {
    icon: Star,
    title: "Kundli Consultation",
    description:
      "Understand your birth chart, planetary influences and important life phases with personalized guidance.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Career & Business",
    description:
      "Seek astrological guidance for career decisions, business opportunities and professional growth.",
  },
  {
    icon: HeartHandshake,
    title: "Relationship Guidance",
    description:
      "Receive thoughtful guidance for relationships, compatibility and important personal decisions.",
  },
  {
    icon: CalendarDays,
    title: "Muhurat Guidance",
    description:
      "Find an auspicious time for important occasions, ceremonies, new ventures and other milestones.",
  },
];

export default function AstrologyPage() {
  return (
    <main className="min-h-screen bg-[#fffaf5]">
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-950 to-orange-800">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-orange-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 text-center md:py-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-300/30 bg-white/10 px-5 py-2 text-sm font-semibold text-purple-100 backdrop-blur">
            <Sparkles size={16} />
            DivyaArpan Astrology
          </div>

          <h1 className="mt-7 text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
            Guidance from the
            <span className="block text-amber-300">
              Wisdom of the Stars
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-purple-100">
            Connect with experienced astrologers for personalized guidance on
            your life, career, relationships, business and auspicious occasions.
          </p>

          <Link
            href="/astrology/booking"
            className="mt-9 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-7 py-4 font-bold text-purple-950 shadow-lg transition hover:bg-amber-300"
          >
            Consult an Astrologer
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">
            Astrology Services
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
            Guidance for Important Life Decisions
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Choose the type of guidance you are looking for and take the next
            step with DivyaArpan.
          </p>
        </div>

        <div className="mt-12 grid gap-7 md:grid-cols-2">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.title}
                className="rounded-3xl border border-purple-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                  <Icon size={26} />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-900">
                  {service.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {service.description}
                </p>

                <Link
                  href="/astrology/booking"
                  className="mt-6 inline-flex items-center gap-2 font-bold text-purple-700 hover:text-purple-900"
                >
                  Learn More
                  <ArrowRight size={17} />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-purple-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-3xl bg-purple-50 p-7 text-center">
              <ShieldCheck className="mx-auto text-purple-700" size={32} />
              <h3 className="mt-4 text-xl font-bold text-slate-900">
                Trusted Guidance
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                Connect with astrologers through the DivyaArpan platform.
              </p>
            </div>

            <div className="rounded-3xl bg-orange-50 p-7 text-center">
              <Sparkles className="mx-auto text-orange-600" size={32} />
              <h3 className="mt-4 text-xl font-bold text-slate-900">
                Personalized
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                Guidance designed around your questions and requirements.
              </p>
            </div>

            <div className="rounded-3xl bg-amber-50 p-7 text-center">
              <CalendarDays className="mx-auto text-amber-700" size={32} />
              <h3 className="mt-4 text-xl font-bold text-slate-900">
                Plan with Confidence
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                Seek guidance for important occasions and decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950 via-indigo-950 to-orange-800 px-8 py-14 text-center md:px-14">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Have a question about your future?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-purple-100">
            Connect with DivyaArpan and take the first step toward personalized
            astrological guidance.
          </p>

          <Link
            href="/astrology/booking"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-bold text-purple-800 shadow-lg transition hover:bg-purple-50"
          >
            Consult an Astrologer
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
