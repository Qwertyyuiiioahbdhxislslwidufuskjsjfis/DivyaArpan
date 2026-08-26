"use client";

import Link from "next/link";

export default function PoojaDetailError({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#fffaf5] px-6 py-20">
      <section className="w-full max-w-lg rounded-3xl border border-orange-100 bg-white p-10 text-center shadow-sm" role="alert">
        <h1 className="text-3xl font-bold text-slate-900">Pooja details could not be loaded</h1>
        <p className="mt-3 leading-7 text-slate-600">Please try again or browse the available poojas.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700">Try Again</button>
          <Link href="/poojas" className="rounded-xl border border-orange-600 px-6 py-3 font-semibold text-orange-700 hover:bg-orange-50">Browse Poojas</Link>
        </div>
      </section>
    </main>
  );
}
