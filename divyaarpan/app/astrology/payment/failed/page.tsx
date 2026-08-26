import Link from "next/link";

type Props = {
  searchParams: Promise<{ bookingId?: string }>;
};

export default async function AstrologyPaymentFailedPage({ searchParams }: Props) {
  const { bookingId } = await searchParams;

  return (
    <main className="min-h-screen bg-orange-50 px-6 py-16">
      <section className="mx-auto max-w-2xl rounded-2xl bg-white p-10 text-center shadow-lg">
        <h1 className="text-3xl font-bold text-red-600">Payment was not completed</h1>
        <p className="mt-3 text-slate-600">Your consultation booking is saved. You can retry payment anytime.</p>

        {bookingId && (
          <p className="mt-4 text-sm font-semibold text-slate-700">Booking ID: {bookingId}</p>
        )}

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href={bookingId ? `/astrology/payment?bookingId=${encodeURIComponent(bookingId)}` : "/astrology/booking"} className="rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700">
            Retry Payment
          </Link>
          <Link href="/astrology" className="rounded-xl border border-orange-600 px-6 py-3 font-semibold text-orange-700 hover:bg-orange-50">
            Back to Astrology
          </Link>
        </div>
      </section>
    </main>
  );
}
