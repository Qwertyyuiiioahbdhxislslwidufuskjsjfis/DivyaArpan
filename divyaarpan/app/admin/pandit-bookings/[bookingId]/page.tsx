"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Languages,
  Loader2,
  MapPin,
  Save,
  UserRound,
} from "lucide-react";

type PanditBooking = {
  id: number;
  bookingId: string;
  service: string;
  city: string;
  address: string;
  language: string;
  date: string;
  time: string;
  sankalp: string | null;
  devoteeName: string;
  mobile: string;
  email: string | null;
  status: string;
  paymentStatus: string;
  panditId: number | null;
  panditName: string | null;
  amount: number | null;
  paymentId: string | null;
  paymentOrderId: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function ManagePanditBookingPage() {
  const params = useParams();

  const bookingId = params.bookingId as string;

  const [booking, setBooking] =
    useState<PanditBooking | null>(null);

  const [amount, setAmount] = useState("");
  const [panditName, setPanditName] = useState("");
  const [status, setStatus] = useState("Payment Pending");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function fetchBooking() {
    if (!bookingId) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/pandit-bookings/${encodeURIComponent(
          bookingId
        )}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to load booking."
        );
      }

      const fetchedBooking: PanditBooking = data.booking;

      setBooking(fetchedBooking);

      setAmount(
        fetchedBooking.amount
          ? String(fetchedBooking.amount / 100)
          : ""
      );

      setPanditName(fetchedBooking.panditName || "");
      setStatus(fetchedBooking.status);
    } catch (err) {
      console.error("LOAD BOOKING ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load booking."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  async function handleSave() {
    if (!booking) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `/api/pandit-bookings/${encodeURIComponent(
          booking.bookingId
        )}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            amount,
            panditName,
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to update booking."
        );
      }

      const updatedBooking: PanditBooking = data.booking;

      setBooking(updatedBooking);

      setAmount(
        updatedBooking.amount
          ? String(updatedBooking.amount / 100)
          : ""
      );

      setPanditName(updatedBooking.panditName || "");
      setStatus(updatedBooking.status);

      setSuccess("Booking updated successfully.");
    } catch (err) {
      console.error("SAVE BOOKING ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update booking."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2
            size={42}
            className="mx-auto animate-spin text-orange-600"
          />

          <p className="mt-4 font-semibold text-gray-600">
            Loading booking...
          </p>
        </div>
      </main>
    );
  }

  if (error && !booking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900">
            Unable to Load Booking
          </h1>

          <p className="mt-3 text-gray-600">
            {error}
          </p>

          <Link
            href="/admin/pandit-bookings"
            className="mt-7 inline-flex rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white"
          >
            Back to Bookings
          </Link>
        </div>
      </main>
    );
  }

  if (!booking) {
    return null;
  }

  const formattedDate = booking.date
    ? new Date(
        `${booking.date}T00:00:00`
      ).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}

      <section className="bg-gradient-to-r from-orange-700 via-orange-600 to-amber-500 text-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <Link
            href="/admin/pandit-bookings"
            className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2 text-sm font-medium transition hover:bg-white/25"
          >
            <ArrowLeft size={18} />
            Pandit Bookings
          </Link>

          <p className="mt-7 text-sm font-semibold uppercase tracking-[0.2em] text-orange-100">
            Manage Booking
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            {booking.service}
          </h1>

          <p className="mt-3 text-orange-100">
            Booking ID:{" "}
            <span className="font-bold text-white">
              {booking.bookingId}
            </span>
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1fr_400px]">
        {/* LEFT */}

        <div className="space-y-7">
          {/* Devotee */}

          <div className="rounded-3xl bg-white p-7 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
              Devotee Details
            </p>

            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              {booking.devoteeName}
            </h2>

            <div className="mt-7 grid gap-5 md:grid-cols-2">
              <Detail
                icon={<UserRound size={19} />}
                label="Mobile"
                value={booking.mobile}
              />

              <Detail
                icon={<UserRound size={19} />}
                label="Email"
                value={booking.email || "Not provided"}
              />

              <Detail
                icon={<MapPin size={19} />}
                label="City"
                value={booking.city}
              />

              <Detail
                icon={<MapPin size={19} />}
                label="Pooja Address"
                value={booking.address}
              />
            </div>
          </div>

          {/* Pooja */}

          <div className="rounded-3xl bg-white p-7 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
              Pooja Details
            </p>

            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              {booking.service}
            </h2>

            <div className="mt-7 grid gap-5 md:grid-cols-3">
              <Detail
                icon={<CalendarDays size={19} />}
                label="Date"
                value={formattedDate}
              />

              <Detail
                icon={<Clock3 size={19} />}
                label="Time"
                value={booking.time}
              />

              <Detail
                icon={<Languages size={19} />}
                label="Language"
                value={booking.language}
              />
            </div>
          </div>

          {/* Sankalp */}

          {booking.sankalp && (
            <div className="rounded-3xl bg-white p-7 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                Sankalp
              </p>

              <p className="mt-4 rounded-2xl bg-orange-50 p-5 leading-7 text-gray-700">
                {booking.sankalp}
              </p>
            </div>
          )}

          {/* Payment information */}

          <div className="rounded-3xl bg-white p-7 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
              Payment Information
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <SimpleDetail
                label="Payment Status"
                value={booking.paymentStatus}
              />

              <SimpleDetail
                label="Payment ID"
                value={booking.paymentId || "Not available"}
              />

              <SimpleDetail
                label="Payment Order ID"
                value={
                  booking.paymentOrderId ||
                  "Not available"
                }
              />

              <SimpleDetail
                label="Current Amount"
                value={
                  booking.amount
                    ? `₹${(
                        booking.amount / 100
                      ).toLocaleString("en-IN")}`
                    : "Not assigned"
                }
              />
            </div>
          </div>
        </div>

        {/* RIGHT ADMIN CONTROL */}

        <aside>
          <div className="sticky top-8 rounded-3xl bg-white p-7 shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
              Admin Control
            </p>

            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              Manage Booking
            </h2>

            {/* Amount */}

            <div className="mt-7">
              <label className="text-sm font-semibold text-gray-700">
                Booking Amount
              </label>

              <div className="relative mt-2">
                <IndianRupee
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="number"
                  min="1"
                  step="1"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value)
                  }
                  placeholder="Example: 2100"
                  className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-orange-500"
                />
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Enter the amount in rupees. Example: ₹2,100.
              </p>
            </div>

            {/* Pandit */}

            <div className="mt-6">
              <label className="text-sm font-semibold text-gray-700">
                Assign Pandit
              </label>

              <input
                type="text"
                value={panditName}
                onChange={(e) =>
                  setPanditName(e.target.value)
                }
                placeholder="Enter Pandit name"
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-orange-500"
              />

              <p className="mt-2 text-xs text-gray-500">
                We'll replace this with a verified Pandit
                selection list later.
              </p>
            </div>

            {/* Status */}

            <div className="mt-6">
              <label className="text-sm font-semibold text-gray-700">
                Booking Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-orange-500"
              >
                <option value="Payment Pending">
                  Payment Pending
                </option>

                <option value="Confirmed">
                  Confirmed
                </option>

                <option value="Pandit Assignment Pending">
                  Pandit Assignment Pending
                </option>

                <option value="Pandit Assigned">
                  Pandit Assigned
                </option>

                <option value="Pooja Scheduled">
                  Pooja Scheduled
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>
              </select>
            </div>

            {/* Current status */}

            <div className="mt-6 rounded-2xl bg-gray-50 p-5">
              <SimpleDetail
                label="Current Payment Status"
                value={booking.paymentStatus}
              />

              <div className="mt-4">
                <SimpleDetail
                  label="Current Booking Status"
                  value={booking.status}
                />
              </div>
            </div>

            {/* Error */}

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-700">
                  {error}
                </p>
              </div>
            )}

            {/* Success */}

            {success && (
              <div className="mt-5 flex gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                <CheckCircle2
                  size={20}
                  className="shrink-0 text-green-600"
                />

                <p className="text-sm font-semibold text-green-700">
                  {success}
                </p>
              </div>
            )}

            {/* Save */}

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-orange-400"
            >
              {saving ? (
                <>
                  <Loader2
                    size={20}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Changes
                </>
              )}
            </button>

            <Link
              href={`/book-my-pandit/payment?bookingId=${encodeURIComponent(
                booking.bookingId
              )}`}
              className="mt-3 block w-full rounded-xl border border-orange-200 px-5 py-3 text-center font-semibold text-orange-700 transition hover:bg-orange-50"
            >
              View Customer Payment Page
            </Link>
          </div>
        </aside>
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
    <div className="flex gap-3">
      <div className="mt-1 text-orange-600">
        {icon}
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          {label}
        </p>

        <p className="mt-1 break-words font-semibold text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}

function SimpleDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 break-words font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}