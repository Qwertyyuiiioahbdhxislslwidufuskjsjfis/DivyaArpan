import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  HeartHandshake,
  Languages,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function Pooja() {
  const poojas = [
    {
      name: "Ganesh Pooja",
      description:
        "Seek the blessings of Lord Ganesha for success, prosperity and the removal of obstacles.",
      price: "₹1,100",
      duration: "45–60 Minutes",
      icon: "🙏",
      suitableFor: "New beginnings & prosperity",
    },
    {
      name: "Rudrabhishek",
      description:
        "A sacred Shiva ritual traditionally performed for peace, devotion and spiritual well-being.",
      price: "₹2,100",
      duration: "60–90 Minutes",
      icon: "🔱",
      suitableFor: "Peace & spiritual devotion",
    },
    {
      name: "Satyanarayan Pooja",
      description:
        "A traditional pooja performed with devotion for happiness, gratitude and family prosperity.",
      price: "₹2,500",
      duration: "90–120 Minutes",
      icon: "🪔",
      suitableFor: "Family happiness & gratitude",
    },
    {
      name: "Navgrah Pooja",
      description:
        "Traditional prayers and rituals dedicated to the Navgrahas for harmony and positive energy.",
      price: "₹3,100",
      duration: "90–120 Minutes",
      icon: "🕉️",
      suitableFor: "Harmony & positive energy",
    },
  ];

  return (
    <main className="min-h-screen bg-[#fffaf5]">
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-orange-950 via-orange-900 to-amber-700">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-yellow-300/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 text-center md:py-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/30 bg-white/10 px-5 py-2 text-sm font-semibold text-orange-100 backdrop-blur">
            <Sparkles size={16} />
            DivyaArpan Pooja Services
          </div>

          <h1 className="mt-7 text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
            Sacred Poojas for
            <span className="block text-amber-300">
              Every Spiritual Occasion
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-orange-100">
            Explore traditional poojas and choose the devotional
            service that suits your spiritual needs.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
              <ShieldCheck size={17} className="text-green-300" />
              Trusted Service
            </div>

            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
              <Languages size={17} className="text-amber-300" />
              Multiple Languages
            </div>

            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
              <CalendarDays size={17} className="text-amber-300" />
              Select Your Date
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          INTRODUCTION
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 pb-8 pt-20">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">
              Choose Your Pooja
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
              Popular Pooja Services
            </h2>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              Select a pooja below or explore temples to discover
              temple-specific devotional services.
            </p>
          </div>

          <Link
            href="/temples"
            className="inline-flex items-center gap-2 font-semibold text-orange-700 hover:text-orange-800"
          >
            Explore Temple Poojas
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* =====================================================
          POOJA CARDS
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 pb-24 pt-8">
        <div className="grid gap-7 md:grid-cols-2">
          {poojas.map((pooja) => (
            <article
              key={pooja.name}
              className="group overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="p-7 md:p-8">
                <div className="flex items-start justify-between gap-5">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-3xl">
                    {pooja.icon}
                  </div>

                  <span className="rounded-full bg-green-50 px-4 py-2 text-xs font-bold text-green-700">
                    Available
                  </span>
                </div>

                <h2 className="mt-6 text-2xl font-bold text-slate-900 transition group-hover:text-orange-700">
                  {pooja.name}
                </h2>

                <p className="mt-3 min-h-[56px] leading-7 text-slate-600">
                  {pooja.description}
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-orange-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                      <Clock3 size={16} className="text-orange-600" />
                      Duration
                    </div>

                    <p className="mt-2 font-bold text-slate-900">
                      {pooja.duration}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-orange-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                      <HeartHandshake
                        size={16}
                        className="text-orange-600"
                      />
                      Suitable For
                    </div>

                    <p className="mt-2 font-bold text-slate-900">
                      {pooja.suitableFor}
                    </p>
                  </div>
                </div>

                <div className="mt-7 flex flex-col gap-5 border-t border-orange-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Starting From
                    </p>

                    <p className="mt-1 text-2xl font-extrabold text-orange-700">
                      {pooja.price}
                    </p>
                  </div>

                  <Link
                    href={`/book-my-pandit?service=${encodeURIComponent(
                      pooja.name
                    )}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 font-bold text-white transition hover:bg-orange-700"
                  >
                    Book This Pooja
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}

      <section className="border-y border-orange-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">
              Simple Booking
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
              How DivyaArpan Pooja Booking Works
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-orange-50 p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 font-bold text-white">
                1
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                Choose a Pooja
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Select the ceremony that matches your devotional
                requirement.
              </p>
            </div>

            <div className="rounded-3xl bg-orange-50 p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 font-bold text-white">
                2
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                Enter Your Details
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Choose your city, preferred language, date, time and
                provide your Sankalp.
              </p>
            </div>

            <div className="rounded-3xl bg-orange-50 p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 font-bold text-white">
                3
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                Confirm Your Booking
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Review your pooja details and continue with your
                DivyaArpan booking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          BOOK MY PANDIT CTA
      ====================================================== */}

      <section className="px-6 py-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-orange-950 via-orange-900 to-amber-700 px-8 py-14 md:px-14">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-yellow-300/10 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">
                Book My Pandit
              </p>

              <h2 className="mt-3 max-w-3xl text-3xl font-bold leading-tight text-white md:text-4xl">
                Need a Pandit for a pooja at your home?
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-orange-100">
                Tell us your ceremony, city, language and preferred
                date. DivyaArpan will help coordinate your pandit
                booking.
              </p>
            </div>

            <Link
              href="/book-my-pandit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 font-bold text-orange-700 shadow-lg transition hover:bg-orange-50"
            >
              Book My Pandit
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}