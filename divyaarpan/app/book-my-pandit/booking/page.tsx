"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Languages,
  MapPin,
  UserRound,
  Sparkles,
  HeartHandshake,
  ShieldCheck,
} from "lucide-react";

const languages = [
  "Hindi",
  "Marathi",
  "Gujarati",
  "English",
  "Tamil",
  "Telugu",
  "Kannada",
  "Bengali",
];

const timeSlots = [
  "6:00 AM - 8:00 AM",
  "8:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "4:00 PM - 6:00 PM",
  "6:00 PM - 8:00 PM",
];

export default function PanditBookingPage() {
  const searchParams = useSearchParams();

  const service =
    searchParams.get("service") || "Selected Pooja";

  const [city, setCity] = useState(searchParams.get("city") || "");
const [language, setLanguage] = useState(searchParams.get("language") || "");
const [date, setDate] = useState(searchParams.get("date") || "");
const [time, setTime] = useState(searchParams.get("time") || "");
const [sankalp, setSankalp] = useState(searchParams.get("sankalp") || "");

const [devoteeName, setDevoteeName] = useState(
  searchParams.get("devoteeName") || ""
);

const [mobile, setMobile] = useState(
  searchParams.get("mobile") || ""
);

const [alternateMobile, setAlternateMobile] = useState(
  searchParams.get("alternateMobile") || ""
);

const [whatsAppNumber, setWhatsAppNumber] = useState(
  searchParams.get("whatsAppNumber") || ""
);

const [email, setEmail] = useState(
  searchParams.get("email") || ""
);

const [houseNo, setHouseNo] = useState(
  searchParams.get("houseNo") || ""
);

const [buildingName, setBuildingName] = useState(
  searchParams.get("buildingName") || ""
);

const [area, setArea] = useState(
  searchParams.get("area") || ""
);

const [landmark, setLandmark] = useState(
  searchParams.get("landmark") || ""
);

const [pinCode, setPinCode] = useState(
  searchParams.get("pinCode") || ""
);

const [address, setAddress] = useState(
  searchParams.get("address") || ""
);

const [panditPreference, setPanditPreference] = useState(
  searchParams.get("panditPreference") || "Any Verified Pandit"
);

const [samagriRequired, setSamagriRequired] = useState(
  searchParams.get("samagriRequired") !== "false"
);

const [purpose, setPurpose] = useState(
  searchParams.get("purpose") || ""
);

const [additionalRequirements, setAdditionalRequirements] = useState(
  searchParams.get("additionalRequirements") || ""
);

  const canContinue =
  city.trim().length > 0 &&
  language.trim().length > 0 &&
  date.trim().length > 0 &&
  time.trim().length > 0 &&
  devoteeName.trim().length > 0 &&
  mobile.trim().length >= 10 &&
  houseNo.trim().length > 0 &&
  area.trim().length > 0 &&
  pinCode.trim().length === 6;

  const reviewUrl = `/book-my-pandit/review?${new URLSearchParams({
  service,
  city,
  language,
  date,
  time,
  sankalp,

  devoteeName,
  mobile,
  alternateMobile,
  whatsAppNumber,
  email,

  houseNo,
  buildingName,
  area,
  landmark,
  pinCode,
  address,

  panditPreference,
  samagriRequired: String(samagriRequired),
  purpose,
  additionalRequirements,
}).toString()}`;

  return (
    <main className="min-h-screen bg-[#fffaf5]">
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-orange-950 via-orange-900 to-amber-700">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-yellow-300/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-12 md:py-16">
          <Link
            href="/book-my-pandit"
            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-100 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Change Service
          </Link>

          <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/30 bg-white/10 px-4 py-2 text-sm font-semibold text-orange-100 backdrop-blur">
                <Sparkles size={16} />
                Book My Pandit
              </div>

              <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white md:text-5xl">
                Complete Your
                <span className="text-amber-300">
                  {" "}Booking Details
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-lg leading-8 text-orange-100">
                Tell us where and when you need the ceremony
                performed and provide the devotee details.
              </p>
            </div>

            {/* Selected Service */}
            <div className="min-w-[280px] rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
                Selected Ceremony
              </p>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-orange-700">
                  <HeartHandshake size={24} />
                </div>

                <div>
                  <p className="text-xl font-bold text-white">
                    {service}
                  </p>

                  <p className="mt-1 text-sm text-orange-100">
                    Pandit Booking
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PROGRESS
      ====================================================== */}

      <section className="border-b border-orange-100 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-7">
          <div className="flex items-center">
            {/* Service */}
            <div className="flex flex-col items-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-600 text-white shadow-md">
                <CheckCircle2 size={22} />
              </div>

              <span className="mt-2 text-xs font-bold text-green-700">
                Service
              </span>
            </div>

            <div className="mx-3 h-1 flex-1 rounded-full bg-orange-600" />

            {/* Details */}
            <div className="flex flex-col items-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-600 font-bold text-white shadow-md shadow-orange-200">
                2
              </div>

              <span className="mt-2 text-xs font-bold text-orange-700">
                Details
              </span>
            </div>

            <div className="mx-3 h-1 flex-1 rounded-full bg-orange-100" />

            {/* Review */}
            <div className="flex flex-col items-center opacity-50">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-600">
                3
              </div>

              <span className="mt-2 text-xs font-semibold text-slate-600">
                Review
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PAGE INTRO
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 pb-4 pt-14">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">
          Step 2 · Booking Details
        </p>

        <h2 className="mt-3 text-3xl font-bold text-slate-900">
          Tell us about your ceremony
        </h2>

        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          Complete the information below so your pandit request
          can be coordinated according to your requirements.
        </p>
      </section>

      {/* =====================================================
          BOOKING FORM
      ====================================================== */}

      <section className="pb-24 pt-8">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1fr_380px]">
          {/* LEFT */}
          <div className="space-y-8">
            {/* ===============================================
                POOJA PREFERENCES
            ================================================ */}

            <div className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">
              <div className="border-b border-orange-100 bg-orange-50/70 px-7 py-6 md:px-9">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600 font-bold text-white">
                    1
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Pooja Preferences
                    </h2>

                    <p className="mt-1 text-sm text-slate-600">
                      Choose the location, language and preferred
                      schedule.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-7 md:p-9">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* City */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      City
                      <span className="text-orange-600"> *</span>
                    </label>

                    <div className="flex items-center rounded-xl border border-slate-200 bg-white px-4 transition focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100">
                      <MapPin
                        size={20}
                        className="shrink-0 text-orange-600"
                      />

                      <input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Mumbai"
                        className="w-full bg-transparent px-3 py-4 outline-none"
                      />
                    </div>
                  </div>

                  {/* Language */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Preferred Language
                      <span className="text-orange-600"> *</span>
                    </label>

                    <div className="flex items-center rounded-xl border border-slate-200 bg-white px-4 transition focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100">
                      <Languages
                        size={20}
                        className="shrink-0 text-orange-600"
                      />

                      <select
                        value={language}
                        onChange={(e) =>
                          setLanguage(e.target.value)
                        }
                        className="w-full cursor-pointer bg-transparent px-3 py-4 outline-none"
                      >
                        <option value="">
                          Select language
                        </option>

                        {languages.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Preferred Date
                      <span className="text-orange-600"> *</span>
                    </label>

                    <div className="flex items-center rounded-xl border border-slate-200 bg-white px-4 transition focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100">
                      <CalendarDays
                        size={20}
                        className="shrink-0 text-orange-600"
                      />

                      <input
                        type="date"
                        value={date}
                        min={new Date()
                          .toISOString()
                          .split("T")[0]}
                        onChange={(e) =>
                          setDate(e.target.value)
                        }
                        className="w-full cursor-pointer bg-transparent px-3 py-4 outline-none"
                      />
                    </div>
                  </div>

                  {/* Time */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Preferred Time
                      <span className="text-orange-600"> *</span>
                    </label>

                    <div className="flex items-center rounded-xl border border-slate-200 bg-white px-4 transition focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100">
                      <Clock3
                        size={20}
                        className="shrink-0 text-orange-600"
                      />

                      <select
                        value={time}
                        onChange={(e) =>
                          setTime(e.target.value)
                        }
                        className="w-full cursor-pointer bg-transparent px-3 py-4 outline-none"
                      >
                        <option value="">
                          Select time slot
                        </option>

                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                {/* Pandit Preference */}
<div className="md:col-span-2">
  <label className="mb-2 block text-sm font-bold text-slate-700">
    Preferred Pandit
  </label>

  <select
    value={panditPreference}
    onChange={(e) => setPanditPreference(e.target.value)}
    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
  >
    <option>Any Verified Pandit</option>
    <option>Senior Pandit</option>
    <option>Vedic Scholar</option>
    <option>Female Pandit (Where Available)</option>
    <option>No Preference</option>
  </select>

  <p className="mt-2 text-xs text-slate-500">
    We'll try our best to arrange your preferred pandit based on
    availability.
  </p>
</div>

                {/* Sankalp */}
                <div className="mt-8">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <label className="block text-sm font-bold text-slate-700">
                      Sankalp / Special Prayer
                    </label>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                      Optional
                    </span>
                  </div>

                  <textarea
                    value={sankalp}
                    onChange={(e) =>
                      setSankalp(e.target.value)
                    }
                    rows={5}
                    placeholder="Tell the pandit the purpose of your pooja, family prayer or special intention..."
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-4 leading-7 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />

                  <div className="mt-3 flex items-start gap-2">
                    <Sparkles
                      size={15}
                      className="mt-0.5 shrink-0 text-orange-600"
                    />

                    <p className="text-xs leading-5 text-slate-500">
                      You may share the purpose of the pooja,
                      family prayer, mannat or any special
                      requirement.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ===============================================
                DEVOTEE DETAILS
            ================================================ */}

            <div className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">
              <div className="border-b border-orange-100 bg-orange-50/70 px-7 py-6 md:px-9">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600 font-bold text-white">
                    2
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Devotee Details
                    </h2>

                    <p className="mt-1 text-sm text-slate-600">
                      Enter the contact details for this booking.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-7 md:p-9">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Full Name
                      <span className="text-orange-600"> *</span>
                    </label>

                    <div className="flex items-center rounded-xl border border-slate-200 px-4 transition focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100">
                      <UserRound
                        size={20}
                        className="shrink-0 text-orange-600"
                      />

                      <input
                        value={devoteeName}
                        onChange={(e) =>
                          setDevoteeName(e.target.value)
                        }
                        placeholder="Enter devotee name"
                        className="w-full px-3 py-4 outline-none"
                      />
                    </div>
                  </div>

                  {/* Mobile Number */}
<div>
  <label className="mb-2 block text-sm font-bold text-slate-700">
    Mobile Number
    <span className="text-orange-600"> *</span>
  </label>

  <input
    type="tel"
    value={mobile}
    onChange={(e) =>
      setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
    }
    placeholder="+91 98765 43210"
    className="w-full rounded-xl border border-slate-200 px-4 py-4 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
  />
</div>

{/* WhatsApp Number */}
<div>
  <label className="mb-2 block text-sm font-bold text-slate-700">
    WhatsApp Number
  </label>

  <input
    type="tel"
    value={whatsAppNumber}
    onChange={(e) =>
      setWhatsAppNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
    }
    placeholder="+91 98765 43210"
    className="w-full rounded-xl border border-slate-200 px-4 py-4 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
  />
</div>
{/* Alternate Mobile */}
<div>
  <div className="mb-2 flex items-center justify-between">
    <label className="block text-sm font-bold text-slate-700">
      Alternate Mobile
    </label>

    <span className="text-xs text-slate-400">
      Optional
    </span>
  </div>

  <input
    type="tel"
    value={alternateMobile}
    onChange={(e) => setAlternateMobile(e.target.value)}
    placeholder="+91 98765 43210"
    className="w-full rounded-xl border border-slate-200 px-4 py-4 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
  />
</div>

                  {/* Email */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="block text-sm font-bold text-slate-700">
                        Email
                      </label>

                      <span className="text-xs text-slate-400">
                        Optional
                      </span>
                    </div>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-200 px-4 py-4 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>

                  {/* House / Flat No */}
<div>
  <label className="mb-2 block text-sm font-bold text-slate-700">
    House / Flat No.
    <span className="text-orange-600"> *</span>
  </label>

  <input
    value={houseNo}
    onChange={(e) => setHouseNo(e.target.value)}
    placeholder="Flat 401 / B-12"
    className="w-full rounded-xl border border-slate-200 px-4 py-4 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
  />
</div>

{/* Building / Society */}
<div>
  <label className="mb-2 block text-sm font-bold text-slate-700">
    Building / Society
  </label>

  <input
    value={buildingName}
    onChange={(e) => setBuildingName(e.target.value)}
    placeholder="Shiv Shakti Apartment"
    className="w-full rounded-xl border border-slate-200 px-4 py-4 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
  />
</div>

{/* Area / Locality */}
<div>
  <label className="mb-2 block text-sm font-bold text-slate-700">
    Area / Locality
    <span className="text-orange-600"> *</span>
  </label>

  <input
    value={area}
    onChange={(e) => setArea(e.target.value)}
    placeholder="Andheri West"
    className="w-full rounded-xl border border-slate-200 px-4 py-4 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
  />
</div>

{/* PIN Code */}
<div>
  <label className="mb-2 block text-sm font-bold text-slate-700">
    PIN Code
    <span className="text-orange-600"> *</span>
  </label>

  <input
    value={pinCode}
    onChange={(e) =>
  setPinCode(e.target.value.replace(/\D/g, "").slice(0, 6))
}
    placeholder="400053"
    maxLength={6}
    className="w-full rounded-xl border border-slate-200 px-4 py-4 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
  />
</div>

{/* Landmark */}
<div className="md:col-span-2">
  <label className="mb-2 block text-sm font-bold text-slate-700">
    Landmark
  </label>

  <input
    value={landmark}
    onChange={(e) => setLandmark(e.target.value)}
    placeholder="Near Metro Station"
    className="w-full rounded-xl border border-slate-200 px-4 py-4 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
  />
</div>

{/* Complete Address */}
<div className="md:col-span-2">
  <label className="mb-2 block text-sm font-bold text-slate-700">
    Complete Address
  </label>

  <textarea
    value={address}
    onChange={(e) => setAddress(e.target.value)}
    rows={3}
    placeholder="Complete address for the Pandit to reach your location"
    className="w-full rounded-xl border border-slate-200 px-4 py-4 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
  />
</div>
</div>
                <div className="mt-8 flex items-start gap-3 rounded-2xl bg-green-50 p-4">
                  <ShieldCheck
                    size={20}
                    className="mt-0.5 shrink-0 text-green-600"
                  />

                  <div>
                    <p className="text-sm font-bold text-green-800">
                      Booking Information
                    </p>

                    <p className="mt-1 text-sm leading-6 text-green-700">
                      These details will be used for booking
                      confirmation and pandit coordination.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              BOOKING SUMMARY
          ================================================== */}

          <aside>
            <div className="sticky top-28 overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-xl">
              <div className="bg-gradient-to-r from-orange-700 to-orange-600 p-6 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-100">
                  Your Booking
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  {service}
                </h2>

                <p className="mt-2 text-sm text-orange-100">
                  Pandit Service Request
                </p>
              </div>

              <div className="p-6">
                <div className="space-y-5">
                  <SummaryRow
                    label="City"
                    value={city || "Not selected"}
                  />

                  <SummaryRow
                    label="Language"
                    value={language || "Not selected"}
                  />

                  <SummaryRow
                    label="Date"
                    value={date || "Not selected"}
                  />

                  <SummaryRow
                    label="Time"
                    value={time || "Not selected"}
                  />

                  <SummaryRow
                    label="Devotee"
                    value={devoteeName || "Not entered"}
                  />
                  <SummaryRow
  label="Mobile"
  value={mobile || "Not entered"}
/>

<SummaryRow
  label="WhatsApp"
  value={whatsAppNumber || "Not entered"}
/>

<SummaryRow
  label="Address"
  value={
    houseNo
      ? `${houseNo}, ${area}, ${city} - ${pinCode}`
      : "Not entered"
  }
/>
                </div>

                <div className="my-6 border-t border-slate-100" />

                <div className="rounded-2xl bg-orange-50 p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles
                      size={18}
                      className="mt-1 shrink-0 text-orange-600"
                    />

                    <p className="text-sm leading-6 text-orange-900">
                      A suitable pandit will be coordinated based
                      on your selected ceremony, city, language
                      and preferred schedule.
                    </p>
                  </div>
                </div>

                {canContinue ? (
                  <Link
                    href={reviewUrl}
                    className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-4 font-bold text-white shadow-md shadow-orange-100 transition hover:bg-orange-700"
                  >
                    Review Booking
                    <ArrowRight size={19} />
                  </Link>
                ) : (
                  <button
                    disabled
                    className="mt-7 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-200 px-6 py-4 font-bold text-slate-500"
                  >
                    Complete Required Details
                  </button>
                )}

                <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                  You won't be charged at this step.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="max-w-[190px] text-right text-sm font-bold text-slate-800">
        {value}
      </span>
    </div>
  );
}