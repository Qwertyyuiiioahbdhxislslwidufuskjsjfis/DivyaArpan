"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to process your request."
        );
      }

      setMessage(result.message);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to process your request."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-orange-50 px-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-7">
            <div className="text-4xl mb-3">🔐</div>

            <h1 className="text-3xl font-bold text-orange-700">
              Forgot Password?
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Enter your registered email or mobile number to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Registered Email or Mobile
            </label>

            <input
              type="text"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              required
              placeholder="Email or mobile number"
              className="w-full border border-slate-300 rounded-lg p-3 mb-5 outline-none focus:border-orange-500"
            />

            {error && (
              <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}

            {message && (
              <p className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-60"
            >
              {loading ? "Processing..." : "Continue"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="font-semibold text-orange-700 hover:underline"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
