"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to sign in.");

      const next = searchParams.get("next");
      const destination =
        next && next.startsWith("/") && !next.startsWith("//")
          ? next
          : result.user.role === "ADMIN"
            ? "/admin"
            : result.user.role === "PANDIT"
              ? "/pandit/dashboard"
              : "/my-bookings";
      router.replace(destination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-orange-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-orange-700 mb-6">
          Login to DivyaArpan
        </h1>

        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          placeholder="Email"
          className="w-full border rounded-lg p-3 mb-4"
        />

        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          placeholder="Password"
          className="w-full border rounded-lg p-3 mb-6"
        />

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <button disabled={loading} className="w-full bg-orange-600 text-white py-3 rounded-lg disabled:opacity-60">
          {loading ? "Signing in..." : "Login"}
        </button>
        <p className="mt-5 text-center text-sm text-slate-600">
          New to DivyaArpan? <Link href="/register" className="font-semibold text-orange-700 hover:underline">Create an account</Link>
        </p>
      </form>
    </main>
  );
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-orange-50" />
      }
    >
      <LoginForm />
    </Suspense>
  );
}