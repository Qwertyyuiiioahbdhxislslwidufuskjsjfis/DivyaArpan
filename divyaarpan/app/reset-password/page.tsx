"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!token) {
      setError("Invalid or missing password reset link.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to reset your password."
        );
      }

      setMessage(result.message);
      setSuccess(true);
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to reset your password."
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
              Reset Password
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Create a new password for your DivyaDarpan account.
            </p>
          </div>

          {success ? (
            <div className="text-center">
              <div className="rounded-lg bg-green-50 p-4 text-green-700">
                {message}
              </div>

              <Link
                href="/login"
                className="mt-6 inline-block w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                New Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
                minLength={8}
                placeholder="Minimum 8 characters"
                className="w-full border border-slate-300 rounded-lg p-3 mb-4 outline-none focus:border-orange-500"
              />

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Confirm New Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                required
                minLength={8}
                placeholder="Enter password again"
                className="w-full border border-slate-300 rounded-lg p-3 mb-5 outline-none focus:border-orange-500"
              />

              {error && (
                <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-60"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="font-semibold text-orange-700 hover:underline"
                >
                  ← Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-orange-50" />
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
