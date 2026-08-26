"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flower2 } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative -mt-px">
      <div className="relative h-[635px] w-full overflow-hidden bg-[#fff8ed]">
        <Image
          src="/images/hero/hero-temple.jpg"
          alt="DivyaArpan Temple"
          width={1400}
          height={635}
          priority
          sizes="100vw"
          className="absolute inset-0 h-auto w-full max-w-none"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#fff8ed]/95 via-[#fff8ed]/45 via-[45%] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[170px] bg-gradient-to-t from-white/45 to-transparent" />

        <div className="absolute inset-0">
          <div className="mx-auto h-full max-w-[1440px] px-6 lg:px-[104px]">
            <div className="flex h-full items-start pt-[66px]">
              <div className="max-w-[650px]">
                <div className="mb-5 flex items-center gap-3 text-[15px] font-semibold uppercase tracking-[0.12em] text-[#ef4d0b]">
                  <span className="h-px w-8 bg-[#ef4d0b]" />
                  <span>||</span>
                  <span>Faith • Tradition • Devotion</span>
                  <span>||</span>
                  <span className="h-px w-8 bg-[#ef4d0b]" />
                </div>

                <h1 className="font-serif text-[58px] font-bold leading-[1.02] tracking-[-0.03em] text-[#4a2418]">
                  Experience Divinity,
                  <br />
                  Every Day
                </h1>

                <p className="mt-5 max-w-[600px] text-[19px] leading-[1.5] text-[#243b5a]">
                  Your one-stop platform for Poojas, Astrological Guidance,
                  <br />
                  Sacred Products and Pandit Services.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <Link
                    href="/book-my-pandit"
                    className="group flex h-[54px] items-center gap-3 rounded-[12px] bg-[#f45112] px-7 text-[17px] font-bold text-white shadow-sm transition hover:bg-[#e94b00]"
                  >
                    <Flower2 className="h-5 w-5" />
                    <span>Book My Pandit</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/poojas"
                    className="group flex h-[54px] items-center gap-3 rounded-[12px] border-2 border-[#f45112] bg-white/80 px-7 text-[17px] font-bold text-[#ef4d0b] transition hover:bg-white"
                  >
                    <span>Explore Poojas</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
