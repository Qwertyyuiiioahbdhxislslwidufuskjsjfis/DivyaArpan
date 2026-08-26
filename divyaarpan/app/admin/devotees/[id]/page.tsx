"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type TempleBooking = {
  id: number;
  bookingId: string;
  temple: string;
  pooja: string;
  date: string;
  time: string;
  price: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

type PanditBookingSummary = {
  id: number;
  bookingId: string;
  service: string;
  city: string;
  date: string;
  time: string;
  panditName: string | null;
  amount: number | null;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

type AstrologyBookingSummary = {
  id: number;
  bookingId: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  amount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

type Devotee = {
  id: number;
  name: string;
  mobile: string;
  email: string | null;
  city: string | null;
  state: string | null;
  country: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: { id: number; name: string; email: string; phone: string | null; role: string } | null;
  _count: { bookings: number; panditBookings: number; astrologyBookings: number };
  bookings: TempleBooking[];
  panditBookings: PanditBookingSummary[];
  astrologyBookings: AstrologyBookingSummary[];
};

function formatRupees(amountInPaise: number | null) {
  if (amountInPaise === null || amountInPaise === undefined) return "Not set";
  return `₹${(amountInPaise / 100).toLocaleString("en-IN")}`;
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const tone = normalized.includes("cancel") || normalized.includes("fail")
    ? "bg-red-100 text-red-700"
    : normalized.includes("complete") || normalized.includes("confirm")
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tone}`}>{status}</span>;
}

export default function AdminDevoteeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [devotee, setDevotee] = useState<Devotee | null>(null);
  const [form, setForm] = useState({ name: "", mobile: "", email: "", city: "", state: "", country: "India", isActive: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadDevotee() {
      try {
        const response = await fetch(`/api/devotees/${encodeURIComponent(id)}`, { cache: "no-store" });
        const data = await response.json().catch(() => null);
        if (!response.ok || !data) {
          if (response.status === 404) setNotFound(true);
          throw new Error(data?.message || "Unable to load devotee.");
        }
        setDevotee(data.devotee);
        setForm({ name: data.devotee.name, mobile: data.devotee.mobile, email: data.devotee.email || "", city: data.devotee.city || "", state: data.devotee.state || "", country: data.devotee.country, isActive: data.devotee.isActive });
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load devotee.");
      } finally {
        setLoading(false);
      }
    }
    void loadDevotee();
  }, [id]);

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/devotees/${encodeURIComponent(id)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data) throw new Error(data?.message || "Unable to update devotee.");
      setDevotee((current) => (current ? { ...current, ...data.devotee } : data.devotee));
      setMessage("Devotee profile updated successfully.");
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to update devotee.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-orange-50" aria-busy="true" aria-live="polite">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-100 border-t-orange-600" />
          <p className="mt-4 font-semibold text-orange-700">Loading devotee profile...</p>
        </div>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-orange-50 px-6">
        <div className="rounded-2xl bg-white p-10 text-center shadow-lg" role="alert">
          <div className="text-5xl">🔍</div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Devotee not found</h1>
          <p className="mt-3 text-gray-600">This devotee profile does not exist or may have been removed.</p>
          <Link href="/admin/devotees" className="mt-6 inline-flex rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white">Back to Devotees</Link>
        </div>
      </main>
    );
  }

  if (error && !devotee) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-orange-50 px-6">
        <div className="rounded-2xl bg-white p-10 text-center shadow-lg" role="alert">
          <h1 className="text-2xl font-bold text-gray-900">Unable to load devotee</h1>
          <p className="mt-3 text-gray-600">{error}</p>
          <Link href="/admin/devotees" className="mt-6 inline-flex rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white">Back to Devotees</Link>
        </div>
      </main>
    );
  }

  if (!devotee) return null;

  return (
    <main className="min-h-screen bg-orange-50">
      <section className="bg-orange-700 text-white">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <Link href="/admin/devotees" className="text-orange-100 hover:text-white">← Back to Devotees</Link>
          <h1 className="mt-5 text-4xl font-bold">Devotee Profile</h1>
          <p className="mt-2 text-orange-100">Review and maintain registered devotee information.</p>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <form onSubmit={saveProfile} className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Account details</p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900">{devotee.name}</h2>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${form.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {form.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-semibold text-gray-700">
                Full name
                <input required minLength={2} maxLength={100} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal" />
              </label>
              <label className="text-sm font-semibold text-gray-700">
                Mobile number
                <input required value={form.mobile} onChange={(event) => setForm({ ...form, mobile: event.target.value })} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal" />
              </label>
              <label className="text-sm font-semibold text-gray-700">
                Email
                <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal" />
              </label>
              <label className="text-sm font-semibold text-gray-700">
                Country
                <input value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value })} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal" />
              </label>
              <label className="text-sm font-semibold text-gray-700">
                City
                <input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal" />
              </label>
              <label className="text-sm font-semibold text-gray-700">
                State
                <input value={form.state} onChange={(event) => setForm({ ...form, state: event.target.value })} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal" />
              </label>
            </div>
            <label className="mt-6 flex items-center gap-3 text-sm font-semibold text-gray-700">
              <input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} className="h-4 w-4 accent-orange-600" />
              Account is active
            </label>
            {error && <p role="alert" className="mt-5 text-sm font-semibold text-red-600">{error}</p>}
            {message && <p role="status" className="mt-5 text-sm font-semibold text-green-700">{message}</p>}
            <button disabled={saving} className="mt-7 rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700 disabled:opacity-60">
              {saving ? "Saving..." : "Save profile"}
            </button>
          </form>
          <aside className="space-y-5">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Booking activity</p>
              <div className="mt-5 space-y-3 text-gray-700">
                <p className="flex justify-between gap-4"><span>Temple poojas</span><strong>{devotee._count.bookings}</strong></p>
                <p className="flex justify-between gap-4"><span>Pandit bookings</span><strong>{devotee._count.panditBookings}</strong></p>
                <p className="flex justify-between gap-4"><span>Astrology consultations</span><strong>{devotee._count.astrologyBookings}</strong></p>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Account metadata</p>
              <p className="mt-4 text-sm text-gray-600">Joined {new Date(devotee.createdAt).toLocaleDateString("en-IN")}</p>
              <p className="mt-2 text-sm text-gray-600">Last updated {new Date(devotee.updatedAt).toLocaleDateString("en-IN")}</p>
              {devotee.user && <p className="mt-2 text-sm text-gray-600">Login role: {devotee.user.role}</p>}
            </div>
          </aside>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900">Temple &amp; pooja bookings</h3>
            {devotee.bookings.length === 0 ? (
              <p className="mt-4 text-sm text-gray-500">No temple or pooja bookings yet.</p>
            ) : (
              <ul className="mt-4 space-y-4">
                {devotee.bookings.map((booking) => (
                  <li key={booking.id} className="rounded-xl border border-orange-100 p-4 text-sm">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-gray-900">{booking.pooja}</p>
                      <StatusBadge status={booking.status} />
                    </div>
                    <p className="mt-1 text-gray-600">{booking.temple}</p>
                    <p className="mt-1 text-gray-500">{booking.date} · {booking.time}</p>
                    <p className="mt-1 font-semibold text-gray-700">{booking.price}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900">Pandit bookings</h3>
            {devotee.panditBookings.length === 0 ? (
              <p className="mt-4 text-sm text-gray-500">No pandit bookings yet.</p>
            ) : (
              <ul className="mt-4 space-y-4">
                {devotee.panditBookings.map((booking) => (
                  <li key={booking.id} className="rounded-xl border border-orange-100 p-4 text-sm">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-gray-900">{booking.service}</p>
                      <StatusBadge status={booking.status} />
                    </div>
                    <p className="mt-1 text-gray-600">{booking.panditName || "Pandit not assigned"} · {booking.city}</p>
                    <p className="mt-1 text-gray-500">{booking.date} · {booking.time}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-semibold text-gray-700">{formatRupees(booking.amount)}</span>
                      <Link href={`/admin/pandit-bookings/${encodeURIComponent(booking.bookingId)}`} className="font-semibold text-orange-700 hover:text-orange-900">View details</Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900">Astrology consultations</h3>
            {devotee.astrologyBookings.length === 0 ? (
              <p className="mt-4 text-sm text-gray-500">No astrology consultations yet.</p>
            ) : (
              <ul className="mt-4 space-y-4">
                {devotee.astrologyBookings.map((booking) => (
                  <li key={booking.id} className="rounded-xl border border-orange-100 p-4 text-sm">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-gray-900">{booking.service}</p>
                      <StatusBadge status={booking.status} />
                    </div>
                    <p className="mt-1 text-gray-500">{booking.preferredDate} · {booking.preferredTime}</p>
                    <p className="mt-1 font-semibold text-gray-700">{formatRupees(booking.amount)}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
