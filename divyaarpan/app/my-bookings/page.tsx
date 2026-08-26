"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Account = {
  name: string;
  email: string;
  mobile: string;
  city: string | null;
  state: string | null;
  country: string;
  isActive: boolean;
};

type TempleBooking = {
  bookingId: string;
  temple: string;
  pooja: string;
  poojaMode: string;
  price: string;
  duration: string;
  date: string;
  time: string;
  devotees: number;
  sankalp: string | null;
  status: string;
  paymentStatus: string;
  amount: number | null;
  statusHistory: StatusHistory[];
};

type PanditBooking = {
  bookingId: string;
  service: string;
  bookingType: string;
  city: string;
  address: string;
  date: string;
  time: string;
  sankalp: string | null;
  status: string;
  paymentStatus: string;
  amount: number | null;
  panditName: string | null;
  assignedPandit: { name: string; mobile: string } | null;
  statusHistory: StatusHistory[];
};

type AstrologyBooking = {
  bookingId: string;
  service: string;
  consultationMode: string;
  preferredDate: string;
  preferredTime: string;
  question: string;
  status: string;
  paymentStatus: string;
  amount: number;
};

type StatusHistory = { id: number; fromStatus: string | null; toStatus: string; actorRole: string | null; createdAt: string };

type BookingData = { temple: TempleBooking[]; pandit: PanditBooking[]; astrology: AstrologyBooking[] };

function formatAmount(amount: number | null, fallback: string) {
  if (amount !== null) return `₹${(amount / 100).toLocaleString("en-IN")}`;
  return fallback.startsWith("₹") ? fallback : `₹${fallback}`;
}

export default function MyBookings() {
  const [account, setAccount] = useState<Account | null>(null);
  const [bookings, setBookings] = useState<BookingData>({ temple: [], pandit: [], astrology: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  async function updateAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!account) return;
    setSaving(true);
    setSaveMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });
    const result = await response.json();
    if (response.ok) {
      setAccount(result.account);
      setEditing(false);
      setSaveMessage("Profile updated.");
    } else {
      setSaveMessage(result.error || "Unable to update your profile.");
    }
    setSaving(false);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  useEffect(() => {
    async function loadAccount() {
      try {
        const [accountResponse, bookingsResponse] = await Promise.all([
          fetch("/api/account", { cache: "no-store" }),
          fetch("/api/my-bookings", { cache: "no-store" }),
        ]);
        const accountData = await accountResponse.json();
        const bookingsData = await bookingsResponse.json();
        if (!accountResponse.ok || !bookingsResponse.ok) {
          throw new Error(accountData.error || bookingsData.error || "Unable to load your account.");
        }
        setAccount(accountData.account);
        setBookings(bookingsData.bookings);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load your bookings.");
      } finally {
        setLoading(false);
      }
    }
    void loadAccount();
  }, []);

  if (loading) {
    return <main className="min-h-screen bg-orange-50 px-6 py-16"><div className="mx-auto max-w-4xl rounded-2xl bg-white p-12 text-center shadow-lg"><p className="text-lg font-semibold text-orange-700">Loading your account...</p></div></main>;
  }

  if (error) {
    return <main className="min-h-screen bg-orange-50 px-6 py-16"><div className="mx-auto max-w-2xl rounded-2xl bg-white p-10 text-center shadow-lg"><h1 className="text-3xl font-bold text-orange-700">Sign in to view your bookings</h1><p className="mt-3 text-gray-600">{error}</p><Link href="/login?next=/my-bookings" className="mt-7 inline-block rounded-xl bg-orange-600 px-7 py-3 font-semibold text-white">Go to Login</Link></div></main>;
  }

  const hasBookings = bookings.temple.length > 0 || bookings.pandit.length > 0 || bookings.astrology.length > 0;

  return (
    <main className="min-h-screen bg-orange-50 px-6 py-12 md:py-16">
      <section className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div><p className="font-semibold uppercase tracking-[0.18em] text-orange-600">DivyaArpan Account</p><h1 className="mt-2 text-4xl font-bold text-orange-700 md:text-5xl">My Bookings</h1><p className="mt-3 text-lg text-gray-600">Your private booking history and account details.</p></div>
          <Link href="/temples" className="rounded-xl bg-orange-600 px-6 py-3 text-center font-semibold text-white hover:bg-orange-700">Book a Pooja</Link>
        </div>

        {account && <section className="mb-10 rounded-2xl bg-white p-6 shadow-lg md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div><h2 className="text-2xl font-bold text-gray-900">{account.name}</h2><p className="mt-2 text-gray-600">{account.email}</p><p className="mt-1 text-gray-600">{account.mobile}</p>{(account.city || account.state) && <p className="mt-1 text-gray-500">{[account.city, account.state, account.country].filter(Boolean).join(", ")}</p>}</div>
            <div className="flex flex-wrap gap-3"><button type="button" onClick={() => setEditing((value) => !value)} className="rounded-xl border border-orange-600 px-4 py-2 font-semibold text-orange-700">{editing ? "Cancel" : "Edit profile"}</button><button type="button" onClick={logout} className="rounded-xl bg-slate-800 px-4 py-2 font-semibold text-white">Sign out</button><span className={`rounded-full px-4 py-2 text-sm font-semibold ${account.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{account.isActive ? "Active account" : "Inactive account"}</span></div>
          </div>
          {editing && <form onSubmit={updateAccount} className="mt-7 grid gap-4 border-t border-orange-100 pt-6 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">Full name<input name="name" defaultValue={account.name} required className="mt-2 w-full rounded-lg border border-slate-200 p-3 font-normal" /></label>
            <label className="text-sm font-semibold text-slate-700">Mobile number<input name="mobile" defaultValue={account.mobile} required className="mt-2 w-full rounded-lg border border-slate-200 p-3 font-normal" /></label>
            <label className="text-sm font-semibold text-slate-700">City<input name="city" defaultValue={account.city || ""} className="mt-2 w-full rounded-lg border border-slate-200 p-3 font-normal" /></label>
            <label className="text-sm font-semibold text-slate-700">State<input name="state" defaultValue={account.state || ""} className="mt-2 w-full rounded-lg border border-slate-200 p-3 font-normal" /></label>
            <label className="text-sm font-semibold text-slate-700">Country<input name="country" defaultValue={account.country} className="mt-2 w-full rounded-lg border border-slate-200 p-3 font-normal" /></label>
            <div className="sm:col-span-2"><button disabled={saving} className="rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white disabled:opacity-60">{saving ? "Saving..." : "Save profile"}</button>{saveMessage && <p className="mt-3 text-sm text-slate-600">{saveMessage}</p>}</div>
          </form>}
        </section>}

        {!hasBookings ? <section className="rounded-2xl bg-white p-12 text-center shadow-lg"><div className="text-6xl">🙏</div><h2 className="mt-5 text-3xl font-bold text-orange-700">No Bookings Yet</h2><p className="mt-3 text-gray-600">Your confirmed and pending bookings will appear here.</p></section> : <div className="space-y-8">
          {bookings.temple.map((booking) => <BookingCard key={booking.bookingId} kind="temple" title={booking.temple} subtitle={booking.pooja} bookingId={booking.bookingId} status={booking.status} paymentStatus={booking.paymentStatus} amount={formatAmount(booking.amount, booking.price)} date={booking.date} time={booking.time} details={[`Mode: ${booking.poojaMode === "ON_BEHALF" ? "Ghar Se Pooja" : booking.poojaMode === "AT_HOME" ? "Ghar Mein Pooja" : "Mandir Mein Pooja"}`, `Duration: ${booking.duration}`, `Devotees: ${booking.devotees}`]} sankalp={booking.sankalp} statusHistory={booking.statusHistory} />)}
          {bookings.pandit.map((booking) => <BookingCard key={booking.bookingId} kind="pandit" title={booking.service} subtitle={`Book My Pandit · ${booking.bookingType}`} bookingId={booking.bookingId} status={booking.status} paymentStatus={booking.paymentStatus} amount={booking.amount === null ? "Pending quotation" : formatAmount(booking.amount, "0")} date={booking.date} time={booking.time} details={[`Location: ${booking.city}`, `Address: ${booking.address}`, `Pandit: ${booking.assignedPandit?.name || booking.panditName || "Not assigned yet"}`]} sankalp={booking.sankalp} statusHistory={booking.statusHistory} />)}
          {bookings.astrology.map((booking) => <BookingCard key={booking.bookingId} kind="astrology" title={booking.service} subtitle="Astrology Consultation" bookingId={booking.bookingId} status={booking.status} paymentStatus={booking.paymentStatus} amount={formatAmount(booking.amount, "0")} date={booking.preferredDate} time={booking.preferredTime} details={[`Mode: ${booking.consultationMode === "VIDEO_CALL" ? "Video Call" : "Phone Call"}`, `Question: ${booking.question.length > 90 ? `${booking.question.slice(0, 90)}...` : booking.question}`]} sankalp={null} statusHistory={[]} />)}
        </div>}
      </section>
    </main>
  );
}

function BookingCard({ kind, title, subtitle, bookingId, status: initialStatus, paymentStatus, amount, date: initialDate, time: initialTime, details, sankalp, statusHistory }: { kind: "temple" | "pandit" | "astrology"; title: string; subtitle: string; bookingId: string; status: string; paymentStatus: string; amount: string; date: string; time: string; details: string[]; sankalp: string | null; statusHistory: StatusHistory[] }) {
  const [status, setStatus] = useState(initialStatus);
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime);
  const [action, setAction] = useState<"cancel" | "reschedule" | null>(null);
  const [newDate, setNewDate] = useState(initialDate);
  const [newTime, setNewTime] = useState(initialTime);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const canChange = kind !== "astrology" && !["Completed", "Cancelled", "COMPLETED", "CANCELLED", "IN_PROGRESS"].includes(status);
  const endpoint = kind === "temple" ? `/api/bookings/${encodeURIComponent(bookingId)}` : `/api/pandit-bookings/${encodeURIComponent(bookingId)}`;

  async function submitAction(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const body = action === "cancel" ? { action } : { action, date: newDate, time: newTime };
    try {
      const response = await fetch(endpoint, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to update this booking.");
      setStatus(result.booking.status);
      setDate(result.booking.date);
      setTime(result.booking.time);
      setAction(null);
      setMessage(action === "cancel" ? "Booking cancelled." : "Booking rescheduled.");
    } catch (requestError) {
      setMessage(requestError instanceof Error ? requestError.message : "Unable to update this booking.");
    } finally {
      setSaving(false);
    }
  }

  return <article className="overflow-hidden rounded-2xl bg-white shadow-lg"><div className="bg-orange-600 p-6 text-white"><div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div><p className="text-sm font-semibold uppercase tracking-wide text-orange-100">{subtitle}</p><h2 className="mt-1 text-2xl font-bold">{title}</h2></div><span className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">{status}</span></div></div><div className="grid gap-5 p-6 md:grid-cols-2 md:p-8"><Info label="Booking ID" value={bookingId} /><Info label="Payment" value={paymentStatus} /><Info label="Amount" value={amount} /><Info label="Date and time" value={`${date} · ${time}`} />{details.map((detail) => <Info key={detail} label="Booking detail" value={detail} />)}{kind === "astrology" && paymentStatus !== "PAID" && <div className="md:col-span-2"><a href={`/astrology/payment?bookingId=${encodeURIComponent(bookingId)}`} className="inline-flex rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700">Complete Payment</a></div>}{statusHistory.length > 0 && <div className="rounded-xl bg-slate-50 p-4 md:col-span-2"><p className="text-xs font-semibold uppercase tracking-wide text-orange-600">Status history</p><div className="mt-2 space-y-1">{statusHistory.map((entry) => <p key={entry.id} className="text-sm text-slate-600">{entry.fromStatus ? `${entry.fromStatus} → ` : "Created as "}{entry.toStatus} · {new Date(entry.createdAt).toLocaleString("en-IN")}</p>)}</div></div>}{sankalp && <div className="rounded-xl bg-orange-50 p-4 md:col-span-2"><p className="text-xs font-semibold uppercase tracking-wide text-orange-600">Sankalp / Mannat</p><p className="mt-2 text-gray-700">{sankalp}</p></div>}{canChange && <div className="flex flex-wrap gap-3 border-t border-orange-100 pt-5 md:col-span-2"><button type="button" onClick={() => { setAction("reschedule"); setMessage(""); }} className="rounded-xl border border-orange-600 px-4 py-2 font-semibold text-orange-700">Reschedule</button><button type="button" onClick={() => { setAction("cancel"); setMessage(""); }} className="rounded-xl border border-red-200 px-4 py-2 font-semibold text-red-700">Cancel booking</button></div>}{action && <form onSubmit={submitAction} className="rounded-xl bg-orange-50 p-4 md:col-span-2"><p className="font-semibold text-slate-900">{action === "cancel" ? "Cancel this booking?" : "Choose a new date and time"}</p>{action === "reschedule" && <div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold text-slate-700">Date<input type="date" value={newDate} min={new Date().toISOString().slice(0, 10)} onChange={(event) => setNewDate(event.target.value)} required className="mt-2 w-full rounded-lg border border-slate-200 bg-white p-3 font-normal" /></label><label className="text-sm font-semibold text-slate-700">Time<input type={kind === "temple" ? "time" : "text"} value={newTime} onChange={(event) => setNewTime(event.target.value)} required className="mt-2 w-full rounded-lg border border-slate-200 bg-white p-3 font-normal" /></label></div>}<div className="mt-4 flex flex-wrap gap-3"><button disabled={saving} className="rounded-xl bg-orange-600 px-4 py-2 font-semibold text-white disabled:opacity-60">{saving ? "Saving..." : action === "cancel" ? "Confirm cancellation" : "Save new time"}</button><button type="button" disabled={saving} onClick={() => setAction(null)} className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700">Keep booking</button></div></form>}{message && <p role="status" className="text-sm font-semibold text-slate-600 md:col-span-2">{message}</p>}</div></article>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-orange-100 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p><p className="mt-2 font-semibold text-gray-800">{value}</p></div>;
}
