"use client";

import { FormEvent, useState } from "react";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") || "").trim(),
      email: String(form.get("email") || "").trim(),
      phone: String(form.get("phone") || "").trim(),
      message: String(form.get("message") || "").trim(),
    };

    if (payload.name.length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(payload.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!/^\+?[0-9\s-]{10,20}$/.test(payload.phone)) {
      setError("Please enter a valid contact number.");
      return;
    }
    if (payload.message.length < 10) {
      setError("Please share a brief message with at least 10 characters.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Unable to submit your message.");
      }
      setSuccess(result.message || "Thank you for contacting us.");
      event.currentTarget.reset();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to submit your message."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-orange-50 py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-4xl font-bold text-orange-700 mb-6">
          Contact Us
        </h1>

        <p className="text-gray-600 mb-8">
            We&apos;d love to hear from you.
        </p>

        <div className="space-y-4">
          <p><strong>Email:</strong> support@divyaarpan.com</p>
          <p><strong>Phone:</strong> +91 98765 43210</p>
          <p><strong>Address:</strong> Mumbai, Maharashtra</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">
              Name
              <input
                name="name"
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
                className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-slate-800"
              />
            </label>

            <label className="text-sm font-semibold text-slate-700">
              Email
              <input
                name="email"
                type="email"
                required
                maxLength={120}
                autoComplete="email"
                className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-slate-800"
              />
            </label>
          </div>

          <label className="text-sm font-semibold text-slate-700 block">
            Contact Number
            <input
              name="phone"
              type="tel"
              required
              minLength={10}
              maxLength={20}
              autoComplete="tel"
              className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-slate-800"
            />
          </label>

          <label className="text-sm font-semibold text-slate-700 block">
            Message
            <textarea
              name="message"
              required
              minLength={10}
              maxLength={2000}
              rows={5}
              className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-slate-800"
            />
          </label>

          {error && <p role="alert" className="text-sm font-semibold text-red-600">{error}</p>}
          {success && <p role="status" className="text-sm font-semibold text-green-700">{success}</p>}

          <button
            disabled={loading}
            className="w-full md:w-auto rounded-lg bg-orange-600 px-7 py-3 font-semibold text-white hover:bg-orange-700 disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

      </div>
    </main>
  );
}