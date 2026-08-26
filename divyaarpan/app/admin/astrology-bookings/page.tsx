import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import AstrologyStatusControl from "./AstrologyStatusControl";

function formatAmount(amount: number) {
  return `₹${(amount / 100).toLocaleString("en-IN")}`;
}

export default async function AdminAstrologyBookingsPage() {
  const bookings = await prisma.astrologyBooking.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-orange-50">
      <section className="bg-orange-700 text-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <Link href="/admin" className="text-orange-100 hover:text-white">← Back to Dashboard</Link>
          <div className="mt-5">
            <h1 className="text-4xl font-bold">Astrology Consultations</h1>
            <p className="mt-2 text-orange-100">Review consultation requests and manage their operational status.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Consultation Bookings</h2>
          <span className="text-gray-600">Total: {bookings.length}</span>
        </div>

        {bookings.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-md">
            <h3 className="text-xl font-bold text-gray-800">No Astrology Consultations Found</h3>
            <p className="mt-2 text-gray-500">New consultation bookings will appear here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <article key={booking.id} className="overflow-hidden rounded-2xl bg-white shadow-md">
                <div className="flex flex-col gap-4 border-b border-orange-100 p-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold text-orange-700">{booking.bookingId}</h3>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${booking.status === "Confirmed" ? "bg-green-100 text-green-700" : booking.status === "Cancelled" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{booking.status}</span>
                    </div>
                    <p className="mt-3 text-lg font-semibold text-gray-800">{booking.service}</p>
                    <p className="mt-1 text-gray-600">{booking.consultationMode === "VIDEO_CALL" ? "Video Call" : "Phone Call"} · {booking.preferredDate} at {booking.preferredTime}</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="text-2xl font-bold text-green-700">{formatAmount(booking.amount)}</p>
                    <p className="mt-1 text-sm font-semibold text-gray-600">Payment: {booking.paymentStatus}</p>
                  </div>
                </div>

                <div className="grid gap-6 p-6 md:grid-cols-2 xl:grid-cols-4">
                  <div><p className="text-sm text-gray-500">Customer</p><p className="mt-1 font-semibold">{booking.name}</p><p className="mt-1 text-sm text-gray-600">{booking.mobile}</p><p className="mt-1 break-all text-sm text-gray-600">{booking.email}</p></div>
                  <div><p className="text-sm text-gray-500">Birth Details</p><p className="mt-1 font-semibold">{booking.birthDate} at {booking.birthTime}</p><p className="mt-1 text-sm text-gray-600">{booking.birthPlace}</p></div>
                  <div><p className="text-sm text-gray-500">Booked On</p><p className="mt-1 font-semibold">{booking.createdAt.toLocaleDateString("en-IN")}</p><p className="mt-1 text-sm text-gray-600">{booking.createdAt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</p></div>
                  <div><p className="text-sm text-gray-500">Payment Reference</p><p className="mt-1 break-all text-sm font-semibold">{booking.paymentId || "Not paid"}</p><p className="mt-1 break-all text-sm text-gray-600">Order: {booking.paymentOrderId || "Not created"}</p></div>
                </div>

                <div className="mx-6 mb-6 rounded-xl border border-orange-100 bg-orange-50 p-5"><p className="text-sm font-semibold text-orange-700">Consultation Details</p><p className="mt-2 whitespace-pre-wrap text-gray-700">{booking.question}</p></div>
                <div className="px-6 pb-6"><AstrologyStatusControl bookingId={booking.bookingId} currentStatus={booking.status} /></div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
