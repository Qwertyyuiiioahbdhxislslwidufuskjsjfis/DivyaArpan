"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  Phone,
  UserRound,
  XCircle,
} from "lucide-react";

interface BookingOffer {
  id: number;
  expiresAt: string | null;

  booking: {
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
    amount: number | null;
    samagriRequired: boolean;
  };
}

export default function PanditRequestsPage() {
  const [offers, setOffers] =
    useState<BookingOffer[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [processingId, setProcessingId] =
    useState<number | null>(null);
  const [decliningOfferId, setDecliningOfferId] =
    useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/pandit/dashboard",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load booking requests."
        );
      }

      setOffers(
        data.pendingOffers || []
      );
    } catch (err) {
      console.error(
        "LOAD REQUESTS ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load booking requests."
      );
    } finally {
      setLoading(false);
    }
  }

  async function acceptBooking(
    offerId: number
  ) {
    try {
      setProcessingId(offerId);
      setMessage("");
      setError("");

      const response = await fetch(
        `/api/pandit/offers/${offerId}/accept`,
        {
          method: "POST",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to accept booking."
        );
      }

      setMessage(
        "Booking accepted successfully. The booking has been assigned to you."
      );

      await loadRequests();
    } catch (err) {
      console.error(
        "ACCEPT BOOKING ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to accept booking."
      );
    } finally {
      setProcessingId(null);
    }
  }

  async function declineBooking(
    offerId: number
  ) {
    const reason = rejectionReason.trim();
    if (!reason) {
      setError("Please provide a reason for declining this request.");
      return;
    }

    try {
      setProcessingId(offerId);
      setMessage("");
      setError("");

      const response = await fetch(
        `/api/pandit-bookings/offers/${offerId}/reject`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to decline booking."
        );
      }

      setMessage(
        "Booking request declined."
      );

      setDecliningOfferId(null);
      setRejectionReason("");

      await loadRequests();
    } catch (err) {
      console.error(
        "DECLINE BOOKING ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to decline booking."
      );
    } finally {
      setProcessingId(null);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-orange-50">

        <div className="flex min-h-screen items-center justify-center px-6">

          <div className="rounded-3xl bg-white p-10 text-center shadow-xl">

            <Loader2
              size={40}
              className="mx-auto animate-spin text-orange-600"
            />

            <p className="mt-4 font-semibold text-gray-700">
              Loading booking requests...
            </p>

          </div>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">

      {/* Header */}

      <header className="bg-gradient-to-r from-orange-700 via-orange-600 to-amber-500 text-white shadow-lg">

        <div className="mx-auto max-w-7xl px-6 py-8">

          <Link
            href="/pandit/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold transition hover:bg-white/25"
          >
            <ArrowLeft size={18} />
            Dashboard
          </Link>

          <div className="mt-7">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-100">
              DivyaArpan Partner Portal
            </p>

            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              Booking Requests
            </h1>

            <p className="mt-2 max-w-2xl text-orange-100">
              Review new pooja requests and accept
              the bookings that fit your schedule.
            </p>

          </div>

        </div>

      </header>

      {/* Content */}

      <section className="mx-auto max-w-7xl px-6 py-10">

        {/* Success message */}

        {message && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-5 text-green-800">

            <CheckCircle2
              size={22}
              className="mt-0.5 shrink-0"
            />

            <p className="font-medium">
              {message}
            </p>

          </div>
        )}

        {/* Error message */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800">

            <XCircle
              size={22}
              className="mt-0.5 shrink-0"
            />

            <p className="font-medium">
              {error}
            </p>

          </div>
        )}

        {/* Page summary */}

        <div className="mb-7 flex flex-col gap-4 rounded-3xl bg-white p-7 shadow-sm md:flex-row md:items-center md:justify-between">

          <div>

            <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
              Current Requests
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              {offers.length}{" "}
              {offers.length === 1
                ? "booking request"
                : "booking requests"}
            </h2>

          </div>

          <button
            type="button"
            onClick={loadRequests}
            disabled={loading}
            className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Refresh Requests
          </button>

        </div>

        {/* No requests */}

        {offers.length === 0 && (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">

              <Clock3 size={30} />

            </div>

            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              No Pending Requests
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-gray-500">
              There are currently no booking requests
              waiting for your response. New requests
              will appear here when they are offered to you.
            </p>

            <Link
              href="/pandit/dashboard"
              className="mt-7 inline-flex rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
            >
              Back to Dashboard
            </Link>

          </div>
        )}

        {/* Requests */}

        <div className="space-y-6">

          {offers.map((offer) => {

            const isProcessing =
              processingId === offer.id;
            const isExpired = !!offer.expiresAt && new Date(offer.expiresAt) <= new Date();
            const hasFinalPrice = offer.booking.amount !== null;
            const canAccept = !isProcessing && !isExpired && hasFinalPrice;
            const canDecline = !isProcessing && !isExpired;

            return (
              <article
                key={offer.id}
                className="overflow-hidden rounded-3xl bg-white shadow-sm"
              >

                {/* Card header */}

                <div className="border-b border-gray-100 p-7">

                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

                    <div>

                      <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                        New Booking Request
                      </p>

                      <h2 className="mt-2 text-2xl font-bold text-gray-900">
                        {offer.booking.service}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        Booking ID:{" "}
                        <span className="font-semibold text-gray-700">
                          {offer.booking.bookingId}
                        </span>
                      </p>

                    </div>

                    <div className={`rounded-full px-4 py-2 text-sm font-semibold ${isExpired ? "bg-gray-100 text-gray-600" : offer.booking.amount === null ? "bg-amber-50 text-amber-800" : "bg-orange-50 text-orange-700"}`}>
                      {isExpired ? "Offer Expired" : offer.booking.amount === null ? "Awaiting DivyaArpan Quotation" : "Awaiting Response"}
                    </div>

                  </div>

                </div>

                {/* Booking details */}

                <div className="p-7">

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                    <Detail
                      icon={
                        <CalendarDays
                          size={19}
                        />
                      }
                      label="Date"
                      value={offer.booking.date}
                    />

                    <Detail
                      icon={
                        <Clock3
                          size={19}
                        />
                      }
                      label="Time"
                      value={offer.booking.time}
                    />

                    <Detail
                      icon={
                        <MapPin
                          size={19}
                        />
                      }
                      label="Location"
                      value={offer.booking.city}
                    />

                    <Detail
                      icon={
                        <UserRound
                          size={19}
                        />
                      }
                      label="Devotee"
                      value={offer.booking.devoteeName}
                    />

                    <Detail
                      icon={
                        <Phone
                          size={19}
                        />
                      }
                      label="Mobile"
                      value={offer.booking.mobile}
                    />

                    <Detail
                      icon={
                        <span className="text-sm font-bold">
                          EN
                        </span>
                      }
                      label="Language"
                      value={offer.booking.language}
                    />

                    <Detail
                      icon={<span className="text-sm font-bold">INR</span>}
                      label="Final DivyaArpan Customer Price"
                      value={offer.booking.amount === null ? "Awaiting DivyaArpan quotation" : `₹${(offer.booking.amount / 100).toLocaleString("en-IN")}`}
                    />

                    <Detail
                      icon={<span className="text-sm font-bold">S</span>}
                      label="Pooja Samagri"
                      value={offer.booking.samagriRequired ? "Required" : "Not required"}
                    />

                  </div>

                  {/* Address */}

                  <div className="mt-7 rounded-2xl bg-gray-50 p-5">

                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Service Address
                    </p>

                    <p className="mt-2 font-semibold text-gray-800">
                      {offer.booking.address}
                    </p>

                  </div>

                  {isExpired && (
                    <p className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm font-semibold text-gray-700">
                      This offer has expired and can no longer be accepted or declined.
                    </p>
                  )}

                  {!isExpired && offer.booking.amount === null && (
                    <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
                      This request is waiting for the final DivyaArpan customer price. You may decline the request, but you cannot accept it until the price is confirmed.
                    </p>
                  )}

                  {/* Actions */}

                  <div className="mt-7 flex flex-col gap-3 border-t border-gray-100 pt-7 sm:flex-row">

                    <button
                      type="button"
                      disabled={!canAccept}
                      onClick={() =>
                        acceptBooking(
                          offer.id
                        )
                      }
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                    >

                      {isProcessing ? (
                        <>
                          <Loader2
                            size={19}
                            className="animate-spin"
                          />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle2
                            size={19}
                          />
                          Accept Booking
                        </>
                      )}

                    </button>

                    <button
                      type="button"
                      disabled={!canDecline}
                      onClick={() => {
                        setDecliningOfferId(offer.id);
                        setRejectionReason("");
                        setError("");
                      }}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-6 py-3.5 font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                    >

                      <XCircle size={19} />

                      Decline Request

                    </button>

                  </div>

                  {decliningOfferId === offer.id && (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                      <label htmlFor={`rejection-${offer.id}`} className="block text-sm font-semibold text-red-900">
                        Reason for declining
                      </label>
                      <textarea
                        id={`rejection-${offer.id}`}
                        value={rejectionReason}
                        onChange={(event) => setRejectionReason(event.target.value)}
                        maxLength={1000}
                        rows={3}
                        className="mt-2 w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-sm text-gray-900"
                      />
                      <div className="mt-3 flex gap-3">
                        <button type="button" onClick={() => setDecliningOfferId(null)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700">
                          Cancel
                        </button>
                        <button type="button" disabled={isProcessing || !rejectionReason.trim()} onClick={() => declineBooking(offer.id)} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500">
                          Submit Decline
                        </button>
                      </div>
                    </div>
                  )}

                </div>

              </article>
            );
          })}

        </div>

      </section>

    </main>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="mt-0.5 text-gray-400">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-gray-800">
          {value}
        </p>

      </div>

    </div>
  );
}