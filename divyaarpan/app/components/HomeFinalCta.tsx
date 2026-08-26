import Link from "next/link";
import { ArrowRight, Flower2 } from "lucide-react";

export default function HomeFinalCta() {
  return (
    <section className="bg-[#fffaf5] px-6 pb-24 pt-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[28px] bg-[#10264b] px-7 py-12 text-center shadow-xl md:px-12 md:py-16">
        <div className="flex justify-center text-orange-300">
          <Flower2 size={30} strokeWidth={1.6} />
        </div>
        <h2 className="mt-5 font-serif text-3xl font-bold text-white md:text-5xl">
          Begin your next devotional offering.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-blue-100 md:text-lg">
          Choose a Pooja or explore a temple listing, then continue with the
          existing DivyaArpan booking journey at your own pace.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/poojas"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#f45112] px-6 py-3.5 font-bold text-white transition hover:bg-[#e94b00]"
          >
            Book a Pooja
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/temples"
            className="inline-flex items-center justify-center rounded-xl border border-blue-200 px-6 py-3.5 font-bold text-white transition hover:bg-white hover:text-[#10264b]"
          >
            Explore Temples
          </Link>
        </div>
      </div>
    </section>
  );
}
