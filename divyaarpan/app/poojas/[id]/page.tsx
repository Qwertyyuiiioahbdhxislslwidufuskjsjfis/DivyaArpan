import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock3, MapPin, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "../../lib/prisma";

async function getPooja(id: string) {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    notFound();
  }

  const pooja = await prisma.pooja.findFirst({
    where: {
      id: numericId,
      isActive: true,
    },
    include: {
      temple: {
        select: {
          id: true,
          slug: true,
          name: true,
          city: true,
          state: true,
          address: true,
          featuredImage: true,
        },
      },
    },
  });

  if (!pooja) {
    notFound();
  }

  return pooja;
}

export default async function PoojaDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pooja = await getPooja(id);

  return (
    <main className="min-h-screen bg-[#fffaf5]">
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-950 via-orange-900 to-amber-700">
        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-10">
          <Link
            href="/poojas"
            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-100 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Browse Poojas
          </Link>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/30 bg-white/10 px-4 py-2 text-sm font-semibold text-orange-100 backdrop-blur">
                <Sparkles size={15} />
                Active Pooja Service
              </div>
              <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
                {pooja.name}
              </h1>
              <p className="mt-5 flex items-start gap-2 text-lg text-orange-100">
                <MapPin size={21} className="mt-1 shrink-0 text-amber-300" />
                <span>
                  {pooja.temple.name}, {pooja.temple.city}, {pooja.temple.state}
                </span>
              </p>
              <p className="mt-6 max-w-2xl text-base leading-8 text-orange-100/90">
                {pooja.description}
              </p>
              <Link
                href={`/booking?templeId=${pooja.temple.id}&poojaId=${pooja.id}&temple=${encodeURIComponent(pooja.temple.name)}&pooja=${encodeURIComponent(pooja.name)}`}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-orange-700 shadow-lg transition hover:bg-orange-50"
              >
                Book This Pooja
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-2 shadow-2xl backdrop-blur">
              {pooja.image ? (
                <Image
                  src={pooja.image}
                  alt={pooja.name}
                  width={1200}
                  height={700}
                  unoptimized
                  className="h-[360px] w-full rounded-2xl object-cover md:h-[420px]"
                />
              ) : (
                <div className="flex h-[360px] items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-amber-50 text-8xl md:h-[420px]">
                  🙏
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <article className="rounded-3xl border border-orange-100 bg-white p-7 shadow-sm md:p-9">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">
              About this Pooja
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Service details</h2>
            <p className="mt-5 leading-8 text-slate-600">{pooja.description}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-orange-50 p-5">
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                  <Clock3 size={17} className="text-orange-600" />
                  Duration
                </p>
                <p className="mt-2 text-xl font-bold text-slate-900">{pooja.duration}</p>
              </div>
              <div className="rounded-2xl bg-orange-50 p-5">
                <p className="text-sm font-semibold text-slate-500">Listed price</p>
                <p className="mt-2 text-xl font-bold text-orange-700">{pooja.price}</p>
              </div>
            </div>
          </article>

          <aside className="rounded-3xl border border-orange-100 bg-white p-7 shadow-sm md:p-9">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">
              Associated Temple
            </p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900">{pooja.temple.name}</h2>
            <p className="mt-3 flex items-start gap-2 leading-7 text-slate-600">
              <MapPin size={18} className="mt-1 shrink-0 text-orange-600" />
              <span>
                {pooja.temple.address}
                <br />
                {pooja.temple.city}, {pooja.temple.state}
              </span>
            </p>
            <Link
              href={`/temples/${pooja.temple.slug}`}
              className="mt-7 inline-flex items-center gap-2 rounded-xl border border-orange-600 px-5 py-3 font-bold text-orange-700 transition hover:bg-orange-50"
            >
              View Temple
              <ArrowRight size={17} />
            </Link>
          </aside>
        </div>

        <div className="mt-12 rounded-3xl bg-orange-50 px-6 py-10 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Ready to make your booking?</h2>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-600">
            Continue with the existing DivyaArpan booking form to add devotee details,
            date, time and your Sankalp.
          </p>
          <Link
            href={`/booking?templeId=${pooja.temple.id}&poojaId=${pooja.id}&temple=${encodeURIComponent(pooja.temple.name)}&pooja=${encodeURIComponent(pooja.name)}`}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 font-bold text-white transition hover:bg-orange-700"
          >
            Book This Pooja
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
