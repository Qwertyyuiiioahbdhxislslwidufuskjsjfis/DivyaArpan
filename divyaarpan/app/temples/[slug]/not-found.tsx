import Link from "next/link";

export default function TempleNotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#fffaf5] px-6 py-20">
      <section className="w-full max-w-lg rounded-3xl border border-orange-100 bg-white p-10 text-center shadow-sm">
        <div className="text-5xl">🛕</div>
        <h1 className="mt-5 text-3xl font-bold text-slate-900">Temple not found</h1>
        <p className="mt-3 leading-7 text-slate-600">
          This temple listing may have moved or is not available yet.
        </p>
        <Link
          href="/temples"
          className="mt-7 inline-flex rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
        >
          Browse Temples
        </Link>
      </section>
    </main>
  );
}