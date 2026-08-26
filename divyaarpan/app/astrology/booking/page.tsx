"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { ASTROLOGY_SERVICES } from "@/app/lib/astrology";

type Account = {
  name: string;
  email: string;
  mobile: string;
};

export default function AstrologyBookingPage() {
  const router = useRouter();
  const [account, setAccount] = useState<Account | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAccount() {
      try {
        const response = await fetch("/api/account", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) {
          setAccount(null);
          return;
        }
        setAccount(data.account);
      } catch {
        setAccount(null);
      } finally {
        setCheckingAuth(false);
      }
    }

    void loadAccount();
  }, []);

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const payload = {
      serviceCode: String(form.get("serviceCode") || ""),
      consultationMode: String(form.get("consultationMode") || ""),
      name: String(form.get("name") || "").trim(),
      email: String(form.get("email") || "").trim(),
      mobile: String(form.get("mobile") || "").trim(),
      birthDate: String(form.get("birthDate") || ""),
      birthTime: String(form.get("birthTime") || ""),
      birthPlace: String(form.get("birthPlace") || "").trim(),
      preferredDate: String(form.get("preferredDate") || ""),
      preferredTime: String(form.get("preferredTime") || ""),
      question: String(form.get("question") || "").trim(),
    };

    try {
      const response = await fetch("/api/astrology-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Unable to create astrology booking.");
      }

      router.push(`/astrology/payment?bookingId=${encodeURIComponent(result.booking.bookingId)}`);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to create astrology booking.");
      setLoading(false);
    }
  }

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-[#fffaf5] px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-12 text-center shadow-lg">
          <p className="text-lg font-semibold text-purple-800">Checking your account...</p>
        </div>
      </main>
    );
  }

  if (!account) {
    return (
      <main className="min-h-screen bg-[#fffaf5] px-6 py-16">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-10 text-center shadow-lg">
          <h1 className="text-3xl font-bold text-purple-900">Sign in to book astrology consultation</h1>
          <p className="mt-3 text-slate-600">Your consultation booking and payment will be saved in your DivyaArpan account.</p>
          <Link href="/login?next=/astrology/booking" className="mt-7 inline-block rounded-xl bg-orange-600 px-7 py-3 font-semibold text-white hover:bg-orange-700">
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf5] px-6 py-12 md:py-16">
      <section className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-white p-6 shadow-lg md:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">DivyaArpan Astrology</p>
          <h1 className="mt-2 text-3xl font-bold text-purple-950 md:text-4xl">Book Your Consultation</h1>
          <p className="mt-3 text-slate-600">Share your details and preferred consultation slot. Secure payment is available in the next step.</p>

          <form onSubmit={submitBooking} className="mt-8 space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">
                Consultation Service
                <select name="serviceCode" required className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-slate-800">
                  {ASTROLOGY_SERVICES.map((service) => (
                    <option key={service.code} value={service.code}>
                      {service.name} ({`₹${(service.amount / 100).toLocaleString("en-IN")}`})
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm font-semibold text-slate-700">
                Consultation Mode
                <select name="consultationMode" required className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-slate-800" defaultValue="VIDEO_CALL">
                  <option value="VIDEO_CALL">Video Call</option>
                  <option value="PHONE_CALL">Phone Call</option>
                </select>
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">Name
                <input name="name" required minLength={2} maxLength={100} defaultValue={account.name} className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-slate-800" />
              </label>
              <label className="text-sm font-semibold text-slate-700">Email
                <input name="email" type="email" required defaultValue={account.email} className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-slate-800" />
              </label>
            </div>

            <label className="text-sm font-semibold text-slate-700 block">Contact Number
              <input name="mobile" type="tel" required minLength={10} maxLength={20} defaultValue={account.mobile} className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-slate-800" />
            </label>

            <div className="grid gap-5 md:grid-cols-3">
              <label className="text-sm font-semibold text-slate-700">Birth Date
                <input name="birthDate" type="date" required className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-slate-800" />
              </label>
              <label className="text-sm font-semibold text-slate-700">Birth Time
                <input name="birthTime" type="time" required className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-slate-800" />
              </label>
              <label className="text-sm font-semibold text-slate-700">Birth Place
                <input name="birthPlace" required minLength={2} maxLength={140} placeholder="City, State" className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-slate-800" />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">Preferred Date
                <input name="preferredDate" type="date" required min={new Date().toISOString().slice(0, 10)} className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-slate-800" />
              </label>
              <label className="text-sm font-semibold text-slate-700">Preferred Time
                <input name="preferredTime" type="time" required className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-slate-800" />
              </label>
            </div>

            <label className="text-sm font-semibold text-slate-700 block">Consultation Details / Questions
              <textarea name="question" required minLength={15} maxLength={2000} rows={5} placeholder="Share your concerns and the guidance you are looking for." className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-slate-800" />
            </label>

            {error && <p role="alert" className="text-sm font-semibold text-red-600">{error}</p>}

            <button disabled={loading} className="w-full rounded-xl bg-orange-600 px-6 py-3.5 font-bold text-white hover:bg-orange-700 disabled:opacity-60">
              {loading ? "Creating consultation booking..." : "Continue to Payment"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
