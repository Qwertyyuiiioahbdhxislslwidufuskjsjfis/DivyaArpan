"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type StatusHistory = {
  id: number;
  fromStatus: string | null;
  toStatus: string;
  actorRole: string;
  createdAt: string;
};

type Booking = {
  id: number;
  bookingId: string;
  service: string;
  city: string;
  date: string;
  time: string;
  devoteeName: string;
  mobile: string;
  language: string;
  address: string;
  status: string;
  paymentStatus: string;
  samagriRequired: boolean;
  amount: number | null;
  createdAt: string;
  statusHistory?: StatusHistory[];
};

function statusLabel(status: string) {
  switch (status) {
    case "PANDIT_ASSIGNED":
      return "Pandit Assigned";
    case "CONFIRMED":
      return "Confirmed";
    case "AWAITING_PAYMENT":
      return "Awaiting Customer Payment";
    case "NO_PANDIT_AVAILABLE":
      return "No Pandit Available";
    case "PANDIT_ON_THE_WAY":
      return "On the Way";
    case "IN_PROGRESS":
      return "In Progress";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status.replaceAll("_", " ");
  }
}

function statusGuidance(booking: Booking) {
  if (booking.status === "AWAITING_PAYMENT") return booking.paymentStatus === "FAILED" ? "Customer payment failed. The customer can retry payment; do not start the Pooja yet." : "Waiting for customer payment. Do not start the Pooja until the booking is confirmed.";
  if (booking.status === "PANDIT_ASSIGNED") return "You have been assigned. DivyaArpan is preparing the booking for payment.";
  if (booking.status === "CONFIRMED") return "Customer payment is confirmed. You may begin travel when ready.";
  if (booking.status === "PANDIT_ON_THE_WAY") return "You are marked as on the way. Start the Pooja once you arrive.";
  if (booking.status === "IN_PROGRESS") return "The Pooja is in progress. Mark it completed only after it is finished.";
  if (booking.status === "COMPLETED") return "This Pooja has been completed. No further action is available.";
  if (booking.status === "CANCELLED") return "This booking was cancelled. No further action is available.";
  return "This booking is not currently actionable.";
}

export default function PanditBookingDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const bookingId = String(params.bookingId);

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBooking() {
      try {
        const response = await fetch(
          `/api/pandit-bookings/${encodeURIComponent(bookingId)}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to load booking."
          );
        }

        setBooking(data.booking);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load booking."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadBooking();
  }, [bookingId]);

  async function updateBookingStatus(nextStatus: string) {
    if (!booking) return;

    try {
      setError("");

      const response = await fetch(
        `/api/pandit-bookings/${encodeURIComponent(booking.bookingId)}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: nextStatus,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to update booking status."
        );
      }

      setBooking((current) => {
        if (!current) return current;

        return {
          ...current,
          status: result.booking.status,
          statusHistory: [
            ...(current.statusHistory || []),
            {
              id: Date.now(),
              fromStatus: current.status,
              toStatus: result.booking.status,
              actorRole: "PANDIT",
              createdAt: new Date().toISOString(),
            },
          ],
        };
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update booking status."
      );
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <p className="font-semibold text-gray-700">
            Loading booking...
          </p>
        </div>
      </main>
    );
  }

  if (error || !booking) {
    return (
      <main className="min-h-screen bg-orange-50 px-6 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg p-10 text-center">
          <div className="text-5xl mb-5">🙏</div>

          <h1 className="text-2xl font-bold text-gray-900">
            Booking Not Found
          </h1>

          <p className="mt-3 text-gray-600">
            {error || "Unable to find this booking."}
          </p>

          <button
            onClick={() => router.push("/pandit/bookings")}
            className="mt-7 rounded-xl bg-orange-600 px-6 py-3 font-bold text-white hover:bg-orange-700"
          >
            Back to My Bookings
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-orange-50">
      <section className="bg-gradient-to-r from-orange-700 to-orange-500 text-white">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <button
            onClick={() => router.push("/pandit/bookings")}
            className="text-orange-100 hover:text-white font-semibold"
          >
            ← Back to My Bookings
          </button>

          <p className="mt-7 text-orange-100 font-semibold tracking-wide">
            DIVYAARPAN PANDIT PORTAL
          </p>

          <h1 className="text-4xl font-bold mt-2">
            Booking Details
          </h1>

          <p className="mt-3 text-orange-100">
            Booking ID: {booking.bookingId}
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-10 space-y-6">

        <div className="bg-white rounded-3xl shadow-md p-7">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">
                Current Status
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                {statusLabel(booking.status)}
              </h2>
            </div>

            <span className="inline-flex w-fit rounded-full bg-orange-100 px-5 py-2 font-bold text-orange-700">
              {statusLabel(booking.status)}
            </span>
          </div>
        </div>

          <div className="bg-white rounded-3xl shadow-md p-7">
            <h2 className="text-xl font-bold text-gray-900">
              🕉️ Booking Actions
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {statusGuidance(booking)}
            </p>

            <div className="mt-6">
              {booking.status === "CONFIRMED" && (
                <button
                  type="button"
                  onClick={() => updateBookingStatus("PANDIT_ON_THE_WAY")}
                  className="w-full rounded-xl bg-orange-600 px-6 py-4 font-bold text-white shadow-md hover:bg-orange-700"
                >
                  🚗 I&apos;m On The Way
                </button>
              )}

              {booking.status === "PANDIT_ON_THE_WAY" && (
                <button
                  type="button"
                  onClick={() => updateBookingStatus("IN_PROGRESS")}
                  className="w-full rounded-xl bg-orange-600 px-6 py-4 font-bold text-white shadow-md hover:bg-orange-700"
                >
                  🪔 Start Pooja
                </button>
              )}

              {booking.status === "IN_PROGRESS" && (
                <button
                  type="button"
                  onClick={() => updateBookingStatus("COMPLETED")}
                  className="w-full rounded-xl bg-green-600 px-6 py-4 font-bold text-white shadow-md hover:bg-green-700"
                >
                  🙏 Complete Pooja
                </button>
              )}

              {booking.status === "COMPLETED" && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-6 py-4 text-center font-bold text-green-700">
                  ✓ Pooja Completed
                </div>
              )}

              {booking.status === "CANCELLED" && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-center font-bold text-red-700">
                  This booking has been cancelled
                </div>
              )}

              {booking.status === "AWAITING_PAYMENT" && (
                <div className="rounded-xl border border-orange-200 bg-orange-50 px-6 py-4 text-center font-bold text-orange-700">
                  Customer payment is required before this booking can be confirmed
                </div>
              )}
            </div>
          </div>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-white rounded-3xl shadow-md p-7">
            <h2 className="text-xl font-bold text-gray-900">
              🪔 Pooja Details
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-sm text-gray-500">Service</p>
                <p className="font-semibold text-gray-900">
                  {booking.service}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-semibold text-gray-900">
                  {booking.date}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-semibold text-gray-900">
                  {booking.time}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Language</p>
                <p className="font-semibold text-gray-900">
                  {booking.language}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Pooja Samagri</p>
                <p className="font-semibold text-gray-900">{booking.samagriRequired ? "Required" : "Not required"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-md p-7">
            <h2 className="text-xl font-bold text-gray-900">
              👤 Devotee Details
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-semibold text-gray-900">
                  {booking.devoteeName}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Mobile</p>
                <p className="font-semibold text-gray-900">
                  {booking.mobile}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">City</p>
                <p className="font-semibold text-gray-900">
                  {booking.city}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-semibold text-gray-900">
                  {booking.address}
                </p>
              </div>
            </div>
          </div>

        </div>

        <div className="bg-white rounded-3xl shadow-md p-7">
          <h2 className="text-xl font-bold text-gray-900">
            💰 DivyaArpan Booking Amount
          </h2>

          <p className="mt-3 text-3xl font-bold text-orange-600">
            {booking.amount !== null
              ? `₹${(booking.amount / 100).toLocaleString("en-IN")}`
              : "Not available"}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-md p-7">
          <h2 className="text-xl font-bold text-gray-900">Payment Status</h2>
          <p className={`mt-3 text-2xl font-bold ${booking.paymentStatus === "PAID" ? "text-green-600" : booking.paymentStatus === "FAILED" ? "text-red-600" : "text-orange-600"}`}>
            {booking.paymentStatus === "PAID" ? "Paid" : booking.paymentStatus === "FAILED" ? "Payment failed - customer may retry" : "Payment pending"}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-md p-7">
          <h2 className="text-xl font-bold text-gray-900">
            📋 Booking Timeline
          </h2>

          {booking.statusHistory &&
          booking.statusHistory.length > 0 ? (
            <div className="mt-6 space-y-5">
              {booking.statusHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 border-l-2 border-orange-200 pl-5"
                >
                  <div>
                    <p className="font-bold text-gray-900">
                      {statusLabel(item.toStatus)}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {item.fromStatus
                        ? `${statusLabel(item.fromStatus)} → ${statusLabel(item.toStatus)}`
                        : statusLabel(item.toStatus)}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(item.createdAt).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-gray-500">
              No status history available.
            </p>
          )}
        </div>

      </section>
    </main>
  );
}
