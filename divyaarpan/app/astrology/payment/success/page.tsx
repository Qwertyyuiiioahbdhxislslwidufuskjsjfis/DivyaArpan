import Link from "next/link";
import { prisma } from "@/app/lib/prisma";

type Props = {
  searchParams: Promise<{ bookingId?: string }>;
};

export default async function AstrologyPaymentSuccessPage({ searchParams }: Props) {
  const { bookingId } = await searchParams;

  if (!bookingId) {
    return (
      <main className="min-h-screen bg-orange-50 px-6 py-16">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-10 text-center shadow-lg">
          <h1 className="text-3xl font-bold text-red-600">Booking ID missing</h1>
          <Link href="/astrology/booking" className="mt-6 inline-block rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white">Back to Astrology Booking</Link>
        </div>
      </main>
    );
  }

  const booking = await prisma.astrologyBooking.findUnique({ where: { bookingId } });

  if (!booking) {
    return (
      <main className="min-h-screen bg-orange-50 px-6 py-16">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-10 text-center shadow-lg">
          <h1 className="text-3xl font-bold text-red-600">Consultation booking not found</h1>
          <Link href="/astrology/booking" className="mt-6 inline-block rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white">Back to Astrology Booking</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-orange-50 px-6 py-14">
      <section className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-green-700">Payment Successful</p>
        <h1 className="mt-2 text-3xl font-bold text-orange-700">Your astrology consultation is confirmed</h1>
        <p className="mt-3 text-slate-600">Our team will connect with you before your preferred slot.</p>

        <div className="mt-8 rounded-xl bg-orange-50 p-6">
          <p><strong>Booking ID:</strong> {booking.bookingId}</p>
          <p className="mt-2"><strong>Service:</strong> {booking.service}</p>
          <p className="mt-2"><strong>Preferred Slot:</strong> {booking.preferredDate} at {booking.preferredTime}</p>
          <p className="mt-2"><strong>Consultation Mode:</strong> {booking.consultationMode === "VIDEO_CALL" ? "Video Call" : "Phone Call"}</p>
          <p className="mt-2"><strong>Payment Status:</strong> {booking.paymentStatus}</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/my-bookings" className="rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700">View My Bookings</Link>
          <Link href="/astrology" className="rounded-xl border border-orange-600 px-6 py-3 font-semibold text-orange-700 hover:bg-orange-50">Back to Astrology</Link>
        </div>
      </section>
    </main>
  );
}
