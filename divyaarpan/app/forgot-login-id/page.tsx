"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function ForgotLoginIdPage() {
  const [identifier, setIdentifier] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-login-id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: identifier.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to recover your Login ID."
        );
      }

      setMessage(result.message || "If an account matches the provided information, recovery instructions will be sent.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to recover your Login ID."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-orange-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center">
            <div className="text-4xl mb-3">🙏</div>

            <h1 className="text-3xl font-bold text-orange-700">
              Forgot Login ID?
            </h1>

            <p className="mt-3 text-sm text-gray-600">
              Enter your registered email address or mobile number to
              recover your Pandit Login ID.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Registered Email / Mobile
            </label>

            <input
              type="text"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              required
              placeholder="Email or mobile number"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            {error && (
              <p className="mt-4 text-sm text-red-600">
                {error}
              </p>
            )}

            {message && (
              <div className="mt-5 rounded-xl bg-green-50 border border-green-200 p-5 text-center">
                <p className="text-sm text-green-700">
                  {message}
                </p>

              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold disabled:opacity-60"
            >
              {loading ? "Recovering..." : "Recover Login ID"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <Link
              href="/login?next=/pandit/dashboard"
              className="font-semibold text-orange-700 hover:underline"
            >
              ← Back to Pandit Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
