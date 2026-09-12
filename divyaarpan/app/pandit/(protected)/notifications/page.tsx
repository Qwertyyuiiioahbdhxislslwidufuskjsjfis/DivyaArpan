"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, Loader2 } from "lucide-react";

type Notification = { id: number; type: string; title: string; message: string; isRead: boolean; createdAt: string };

export default function PanditNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadNotifications() {
    try {
      const response = await fetch("/api/pandit/notifications", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to load notifications.");
      setNotifications(result.notifications);
    } catch (loadError) { setError(loadError instanceof Error ? loadError.message : "Unable to load notifications."); }
    finally { setLoading(false); }
  }
  useEffect(() => { void loadNotifications(); }, []);

  async function markRead(notificationId?: number) {
    const response = await fetch("/api/pandit/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(notificationId ? { notificationId } : { action: "mark-all-read" }) });
    if (!response.ok) return;
    setNotifications((current) => current.map((item) => notificationId === undefined || item.id === notificationId ? { ...item, isRead: true } : item));
  }

  const unreadCount = notifications.filter((notification) => !notification.isRead).length;
  return <main className="min-h-screen bg-gray-100"><header className="bg-gradient-to-r from-orange-700 via-orange-600 to-amber-500 text-white"><div className="mx-auto max-w-5xl px-6 py-10"><Link href="/pandit/dashboard" className="text-sm font-semibold text-orange-100 hover:text-white">Back to Dashboard</Link><div className="mt-7 flex items-center gap-3"><Bell size={28} /><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-100">DivyaArpan Partner Portal</p><h1 className="mt-2 text-4xl font-bold">Notifications</h1></div></div></div></header><section className="mx-auto max-w-5xl px-6 py-10">{loading ? <div className="flex justify-center rounded-3xl bg-white p-12"><Loader2 size={36} className="animate-spin text-orange-600" /></div> : error ? <div className="rounded-3xl bg-white p-10 text-center shadow-sm"><p className="text-red-700">{error}</p></div> : <><div className="mb-6 flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm"><p className="font-semibold text-gray-800">{unreadCount} unread notification{unreadCount === 1 ? "" : "s"}</p><button type="button" onClick={() => void markRead()} disabled={!unreadCount} className="rounded-xl border border-orange-600 px-4 py-2 text-sm font-bold text-orange-700 disabled:opacity-40">Mark all read</button></div>{notifications.length === 0 ? <div className="rounded-3xl bg-white p-12 text-center shadow-sm"><Bell className="mx-auto text-gray-300" size={40} /><h2 className="mt-4 text-xl font-bold text-gray-900">No notifications yet</h2></div> : <div className="space-y-4">{notifications.map((notification) => <article key={notification.id} className={`rounded-2xl border p-6 shadow-sm ${notification.isRead ? "border-gray-100 bg-white" : "border-orange-200 bg-orange-50"}`}><div className="flex flex-col gap-3 sm:flex-row sm:justify-between"><div><h2 className="font-bold text-gray-900">{notification.title}</h2><p className="mt-2 text-gray-600">{notification.message}</p><p className="mt-3 text-xs text-gray-500">{new Date(notification.createdAt).toLocaleString("en-IN")}</p></div>{!notification.isRead && <button type="button" onClick={() => void markRead(notification.id)} className="h-fit rounded-lg border border-orange-600 px-3 py-2 text-sm font-semibold text-orange-700">Mark read</button>}</div></article>)}</div>}</>}</section></main>;
}