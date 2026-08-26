"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

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
  _count: { bookings: number; panditBookings: number; astrologyBookings: number };
};

export default function AdminDevoteesPage() {
  const [devotees, setDevotees] = useState<Devotee[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDevotees = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const query = new URLSearchParams();
      if (search.trim()) query.set("search", search.trim());
      if (status !== "all") query.set("status", status);
      const response = await fetch(`/api/devotees?${query.toString()}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to load devotees.");
      setDevotees(data.devotees || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load devotees.");
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadDevotees(), 250);
    return () => window.clearTimeout(timer);
  }, [loadDevotees]);

  return (
    <main className="min-h-screen bg-orange-50">
      <section className="bg-orange-700 text-white"><div className="mx-auto max-w-7xl px-6 py-10"><Link href="/admin" className="text-orange-100 hover:text-white">← Back to Dashboard</Link><h1 className="mt-5 text-4xl font-bold">Manage Devotees</h1><p className="mt-2 text-orange-100">View profiles, booking activity and account status.</p></div></section>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm md:flex-row">
          <label className="flex-1 text-sm font-semibold text-gray-700">Search devotees<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, mobile, email or city" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none focus:border-orange-500" /></label>
          <label className="text-sm font-semibold text-gray-700">Account status<select value={status} onChange={(event) => setStatus(event.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-normal md:w-48"><option value="all">All accounts</option><option value="active">Active only</option><option value="inactive">Inactive only</option></select></label>
        </div>
        {loading && <div className="rounded-2xl bg-white p-12 text-center shadow-sm" aria-busy="true" aria-live="polite"><div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-orange-100 border-t-orange-600" /><p className="mt-4 font-semibold text-orange-700">Loading devotees...</p></div>}
        {!loading && error && <div className="rounded-2xl border border-red-200 bg-red-50 p-6" role="alert"><p className="font-semibold text-red-700">{error}</p><button type="button" onClick={() => void loadDevotees()} className="mt-4 rounded-xl bg-red-600 px-5 py-2 font-semibold text-white">Try Again</button></div>}
        {!loading && !error && devotees.length === 0 && <div className="rounded-2xl bg-white p-12 text-center shadow-sm"><div className="text-5xl">👥</div><h2 className="mt-4 text-2xl font-bold text-gray-900">No devotees found</h2><p className="mt-2 text-gray-600">Try a different search or check another account status.</p></div>}
        {!loading && !error && devotees.length > 0 && <div className="overflow-hidden rounded-2xl bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><caption className="sr-only">Registered devotees</caption><thead className="bg-orange-50 text-sm text-gray-600"><tr><th className="px-6 py-4 font-semibold">Devotee</th><th className="px-6 py-4 font-semibold">Contact</th><th className="px-6 py-4 font-semibold">Location</th><th className="px-6 py-4 font-semibold">Bookings</th><th className="px-6 py-4 font-semibold">Status</th><th className="px-6 py-4"><span className="sr-only">Actions</span></th></tr></thead><tbody className="divide-y divide-orange-100">{devotees.map((devotee) => <tr key={devotee.id}><td className="px-6 py-5"><p className="font-semibold text-gray-900">{devotee.name}</p><p className="mt-1 text-xs text-gray-500">Joined {new Date(devotee.createdAt).toLocaleDateString("en-IN")}</p></td><td className="px-6 py-5"><p>{devotee.mobile}</p><p className="mt-1 break-all text-sm text-gray-500">{devotee.email || "No email"}</p></td><td className="px-6 py-5 text-gray-600">{[devotee.city, devotee.state, devotee.country].filter(Boolean).join(", ") || "Not provided"}</td><td className="px-6 py-5 text-sm text-gray-600">{devotee._count.bookings + devotee._count.panditBookings + devotee._count.astrologyBookings} total</td><td className="px-6 py-5"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${devotee.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{devotee.isActive ? "Active" : "Inactive"}</span></td><td className="px-6 py-5 text-right"><Link href={`/admin/devotees/${devotee.id}`} className="font-semibold text-orange-700 hover:text-orange-900">View profile</Link></td></tr>)}</tbody></table></div></div>}
      </section>
    </main>
  );
}