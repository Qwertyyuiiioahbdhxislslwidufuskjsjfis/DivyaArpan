"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    const confirmation = String(form.get("confirmation") || "");

    if (password !== confirmation) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          mobile: form.get("mobile"),
          password,
          city: form.get("city"),
          state: form.get("state"),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to create your account.");
      router.replace("/my-bookings");
    } catch (registrationError) {
      setError(registrationError instanceof Error ? registrationError.message : "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-orange-50 px-6 py-12">
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Join DivyaArpan</p>
        <h1 className="mt-3 text-3xl font-bold text-orange-700">Create your devotee account</h1>
        <p className="mt-3 text-slate-600">Save your details and keep every temple and Pandit booking together.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Full name<input name="name" required minLength={2} autoComplete="name" className="mt-2 w-full rounded-lg border border-slate-200 p-3 font-normal" /></label>
          <label className="text-sm font-semibold text-slate-700">Email<input name="email" type="email" required autoComplete="email" className="mt-2 w-full rounded-lg border border-slate-200 p-3 font-normal" /></label>
          <label className="text-sm font-semibold text-slate-700">Mobile number<input name="mobile" type="tel" required autoComplete="tel" className="mt-2 w-full rounded-lg border border-slate-200 p-3 font-normal" /></label>
          <label className="text-sm font-semibold text-slate-700">City<input name="city" className="mt-2 w-full rounded-lg border border-slate-200 p-3 font-normal" /></label>
          <label className="text-sm font-semibold text-slate-700">State<input name="state" className="mt-2 w-full rounded-lg border border-slate-200 p-3 font-normal" /></label>
          <label className="text-sm font-semibold text-slate-700">Password<input name="password" type="password" required minLength={8} autoComplete="new-password" className="mt-2 w-full rounded-lg border border-slate-200 p-3 font-normal" /></label>
          <label className="text-sm font-semibold text-slate-700">Confirm password<input name="confirmation" type="password" required minLength={8} autoComplete="new-password" className="mt-2 w-full rounded-lg border border-slate-200 p-3 font-normal" /></label>
        </div>
        {error && <p role="alert" className="mt-5 text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="mt-6 w-full rounded-xl bg-orange-600 py-3.5 font-bold text-white disabled:opacity-60">{loading ? "Creating account..." : "Create account"}</button>
        <p className="mt-5 text-center text-sm text-slate-600">Already have an account? <Link href="/login" className="font-semibold text-orange-700 hover:underline">Sign in</Link></p>
      </form>
    </main>
  );
}
