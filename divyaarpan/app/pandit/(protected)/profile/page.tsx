"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";

type ServiceArea = { id?: number; city: string; area: string; pincode: string | null; serviceRadiusKm: number | null };
type Availability = { id?: number; dayOfWeek: number; startTime: string; endTime: string; isAvailable: boolean };
type Profile = {
  panditCode: string; name: string; mobile: string; email: string | null; profileImage: string | null;
  experienceYears: number; bio: string | null; address: string | null; city: string; state: string; pincode: string | null;
  verificationStatus: string; isActive: boolean; isOnline: boolean; acceptsImmediate: boolean; acceptsScheduled: boolean;
  languages: { language: string }[]; services: { serviceName: string }[]; serviceAreas: ServiceArea[]; availability: Availability[];
};

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const emptyArea = (): ServiceArea => ({ city: "", area: "", pincode: "", serviceRadiusKm: 10 });
const defaultAvailability = (): Availability[] => DAYS.map((_, dayOfWeek) => ({ dayOfWeek, startTime: "09:00", endTime: "18:00", isAvailable: false }));

export default function PanditProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [languagesText, setLanguagesText] = useState("");
  const [servicesText, setServicesText] = useState("");
  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const [availability, setAvailability] = useState<Availability[]>(defaultAvailability());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/pandit/profile", { cache: "no-store" });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Unable to load your profile.");
        const loaded = result.pandit as Profile;
        setProfile(loaded);
        setLanguagesText(loaded.languages.map((item) => item.language).join(", "));
        setServicesText(loaded.services.map((item) => item.serviceName).join(", "));
        setAreas(loaded.serviceAreas);
        setAvailability(DAYS.map((_, dayOfWeek) => loaded.availability.find((item) => item.dayOfWeek === dayOfWeek) || { dayOfWeek, startTime: "09:00", endTime: "18:00", isAvailable: false }));
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load your profile.");
      } finally {
        setLoading(false);
      }
    }
    void loadProfile();
  }, []);

  function updateArea(index: number, field: keyof ServiceArea, value: string) {
    setAreas((current) => current.map((area, areaIndex) => areaIndex === index ? { ...area, [field]: field === "serviceRadiusKm" ? (value === "" ? null : Number(value)) : value } : area));
  }

  function updateAvailability(dayOfWeek: number, field: keyof Availability, value: string | boolean) {
    setAvailability((current) => current.map((slot) => slot.dayOfWeek === dayOfWeek ? { ...slot, [field]: value } : slot));
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile) return;
    setSaving(true); setMessage(""); setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/pandit/profile", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"), mobile: form.get("mobile"), address: form.get("address"), city: form.get("city"), state: form.get("state"), pincode: form.get("pincode"),
          experienceYears: form.get("experienceYears"), bio: form.get("bio"),
          languages: languagesText.split(",").map((item) => item.trim()).filter(Boolean),
          services: servicesText.split(",").map((item) => item.trim()).filter(Boolean),
          serviceAreas: areas,
          availability,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to update your profile.");
      setProfile(result.pandit); setMessage("Profile and availability updated.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to update your profile.");
    } finally { setSaving(false); }
  }

  if (loading) return <main className="min-h-screen bg-orange-50 flex items-center justify-center"><Loader2 className="animate-spin text-orange-600" size={40} /></main>;
  if (!profile) return <main className="min-h-screen bg-orange-50 px-6 py-16"><div className="mx-auto max-w-2xl rounded-3xl bg-white p-10 text-center shadow-xl"><h1 className="text-2xl font-bold text-gray-900">Unable to Load Profile</h1><p className="mt-3 text-gray-600">{error}</p><Link href="/pandit/dashboard" className="mt-7 inline-block rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white">Back to Dashboard</Link></div></main>;

  return <main className="min-h-screen bg-gray-100">
    <header className="bg-gradient-to-r from-orange-700 via-orange-600 to-amber-500 text-white"><div className="mx-auto max-w-6xl px-6 py-10"><Link href="/pandit/dashboard" className="text-sm font-semibold text-orange-100 hover:text-white">Back to Dashboard</Link><p className="mt-7 text-sm font-semibold uppercase tracking-[0.2em] text-orange-100">DivyaArpan Partner Portal</p><h1 className="mt-2 text-4xl font-bold">My Profile</h1><p className="mt-3 text-orange-100">{profile.panditCode} · {profile.verificationStatus}</p></div></header>
    <form onSubmit={saveProfile} className="mx-auto max-w-6xl space-y-7 px-6 py-10">
      {message && <p role="status" className="rounded-xl bg-green-50 p-4 font-semibold text-green-800">{message}</p>}
      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 font-semibold text-red-700">{error}</p>}
      <section className="rounded-3xl bg-white p-7 shadow-sm"><h2 className="text-2xl font-bold text-gray-900">Profile Details</h2><div className="mt-6 grid gap-5 md:grid-cols-2"><Field label="Name" name="name" defaultValue={profile.name} required /><Field label="Mobile" name="mobile" defaultValue={profile.mobile} required /><Field label="Email" name="email" defaultValue={profile.email || ""} disabled /><Field label="Experience (years)" name="experienceYears" type="number" defaultValue={profile.experienceYears} min="0" max="80" required /><Field label="City" name="city" defaultValue={profile.city} required /><Field label="State" name="state" defaultValue={profile.state} required /><Field label="Pincode" name="pincode" defaultValue={profile.pincode || ""} required /><label className="md:col-span-2 text-sm font-semibold text-gray-700">Address<textarea name="address" defaultValue={profile.address || ""} required rows={3} className="mt-2 w-full rounded-xl border border-gray-200 p-3 font-normal" /></label><label className="md:col-span-2 text-sm font-semibold text-gray-700">Bio<textarea name="bio" defaultValue={profile.bio || ""} rows={4} className="mt-2 w-full rounded-xl border border-gray-200 p-3 font-normal" /></label></div></section>
      <section className="rounded-3xl bg-white p-7 shadow-sm"><h2 className="text-2xl font-bold text-gray-900">Languages & Services</h2><p className="mt-2 text-sm text-gray-500">Separate each item with a comma.</p><div className="mt-6 grid gap-5 md:grid-cols-2"><label className="text-sm font-semibold text-gray-700">Languages<input value={languagesText} onChange={(event) => setLanguagesText(event.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 p-3 font-normal" required /></label><label className="text-sm font-semibold text-gray-700">Services<input value={servicesText} onChange={(event) => setServicesText(event.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 p-3 font-normal" required /></label></div></section>
      <section className="rounded-3xl bg-white p-7 shadow-sm"><div className="flex items-center justify-between gap-4"><h2 className="text-2xl font-bold text-gray-900">Service Areas</h2><button type="button" onClick={() => setAreas((current) => [...current, emptyArea()])} className="inline-flex items-center gap-2 rounded-xl border border-orange-600 px-4 py-2 text-sm font-bold text-orange-700"><Plus size={16} /> Add Area</button></div><div className="mt-6 space-y-4">{areas.map((area, index) => <div key={area.id || index} className="grid gap-4 rounded-2xl bg-orange-50 p-4 md:grid-cols-4"><Input label="City" value={area.city} onChange={(value) => updateArea(index, "city", value)} /><Input label="Area" value={area.area} onChange={(value) => updateArea(index, "area", value)} /><Input label="Pincode" value={area.pincode || ""} onChange={(value) => updateArea(index, "pincode", value)} /><div className="flex items-end gap-3"><Input label="Radius (km)" type="number" value={String(area.serviceRadiusKm || "")} onChange={(value) => updateArea(index, "serviceRadiusKm", value)} /><button type="button" disabled={areas.length === 1} onClick={() => setAreas((current) => current.filter((_, areaIndex) => areaIndex !== index))} className="mb-0.5 rounded-xl p-3 text-red-600 disabled:opacity-40" aria-label="Remove service area"><Trash2 size={18} /></button></div></div>)}</div></section>
      <section className="rounded-3xl bg-white p-7 shadow-sm"><h2 className="text-2xl font-bold text-gray-900">Weekly Availability</h2><p className="mt-2 text-sm text-gray-500">A day without a saved availability record retains default matching behavior. Enable a day to set its scheduled booking window.</p><div className="mt-6 space-y-3">{availability.map((slot) => <div key={slot.dayOfWeek} className="grid items-center gap-3 rounded-xl border border-gray-100 p-4 sm:grid-cols-[160px_1fr_1fr]"><label className="flex items-center gap-3 font-semibold text-gray-800"><input type="checkbox" checked={slot.isAvailable} onChange={(event) => updateAvailability(slot.dayOfWeek, "isAvailable", event.target.checked)} className="h-4 w-4 accent-orange-600" />{DAYS[slot.dayOfWeek]}</label><input type="time" value={slot.startTime} disabled={!slot.isAvailable} onChange={(event) => updateAvailability(slot.dayOfWeek, "startTime", event.target.value)} className="rounded-lg border border-gray-200 p-3 disabled:bg-gray-100" /><input type="time" value={slot.endTime} disabled={!slot.isAvailable} onChange={(event) => updateAvailability(slot.dayOfWeek, "endTime", event.target.value)} className="rounded-lg border border-gray-200 p-3 disabled:bg-gray-100" /></div>)}</div></section>
      <button disabled={saving} className="w-full rounded-xl bg-orange-600 px-6 py-4 font-bold text-white hover:bg-orange-700 disabled:opacity-60">{saving ? "Saving profile..." : "Save Profile & Availability"}</button>
    </form>
  </main>;
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) { return <label className="text-sm font-semibold text-gray-700">{label}<input {...props} className="mt-2 w-full rounded-xl border border-gray-200 p-3 font-normal disabled:bg-gray-100" /></label>; }
function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) { return <label className="text-sm font-semibold text-gray-700">{label}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 bg-white p-3 font-normal" /></label>; }