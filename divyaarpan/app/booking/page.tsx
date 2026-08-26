"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type DbPooja = {
  id: number;
  name: string;
  price: string;
  duration: string;
};

type DbTemple = {
  id: number;
  name: string;
  poojas: DbPooja[];
};

type RawPooja = {
  id: number;
  name: string;
  price: string;
  duration: string;
  isActive: boolean;
};

type RawTemple = {
  id: number;
  name: string;
  poojas: RawPooja[];
};

function BookingContent() {

  const searchParams = useSearchParams();

  const urlTemple = searchParams.get("temple");
  const urlPooja = searchParams.get("pooja");
  const urlTempleId = searchParams.get("templeId");
  const urlPoojaId = searchParams.get("poojaId");

  const requestedMode = searchParams.get("mode");
  const poojaMode =
    requestedMode === "ON_BEHALF" || requestedMode === "AT_HOME"
      ? requestedMode
      : "DEVOTEE_PRESENT";


  const [temples, setTemples] = useState<DbTemple[] | null>(null);
  const [selectedTemple, setSelectedTemple] = useState<DbTemple | null>(null);
  const [selectedPooja, setSelectedPooja] = useState<DbPooja | null>(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadTemples() {
      try {
        const response = await fetch("/api/temples", { cache: "no-store" });
        const data = await response.json().catch(() => null);
        if (!response.ok || !Array.isArray(data)) {
          throw new Error("Unable to load temples and poojas.");
        }

        const list: DbTemple[] = (data as RawTemple[])
          .map((temple) => ({
            id: temple.id,
            name: temple.name,
            poojas: (temple.poojas || [])
              .filter((pooja) => pooja.isActive)
              .map((pooja) => ({
                id: pooja.id,
                name: pooja.name,
                duration: pooja.duration,
                price: `\u20b9${pooja.price}`,
              })),
          }))
          .filter((temple) => temple.poojas.length > 0);

        if (cancelled) return;

        if (list.length === 0) {
          setLoadError("No poojas are currently available for booking. Please check back soon.");
          return;
        }

        const matchedTemple = urlTempleId
          ? list.find((item) => String(item.id) === urlTempleId)
          : list.find((item) => item.name === urlTemple) || list[0];
        if (!matchedTemple) throw new Error("The selected temple is unavailable.");
        const matchedPooja = urlPoojaId
          ? matchedTemple.poojas.find((item) => String(item.id) === urlPoojaId)
          : matchedTemple.poojas.find((item) => item.name === urlPooja) || matchedTemple.poojas[0];
        if (!matchedPooja) throw new Error("The selected pooja is unavailable.");

        setTemples(list);
        setSelectedTemple(matchedTemple);
        setSelectedPooja(matchedPooja);
      } catch (loadTemplesError) {
        console.error("DIVYAARPAN: could not load temples", loadTemplesError);
        if (!cancelled) {
          setLoadError(
            loadTemplesError instanceof Error
              ? loadTemplesError.message
              : "Unable to load temples and poojas."
          );
        }
      }
    }

    void loadTemples();
    return () => {
      cancelled = true;
    };
  }, [urlPooja, urlPoojaId, urlTemple, urlTempleId]);


  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [devotees, setDevotees] = useState("1");
  const [sankalp, setSankalp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");



const saveBooking = async () => {

  if (!selectedTemple || !selectedPooja) return;
  setSubmitting(true);
  setSubmitError("");

  const today = new Date().toISOString().slice(0, 10);
  const trimmedName = name.trim();
  const trimmedMobile = mobile.trim();
  const trimmedEmail = email.trim();
  const devoteeCount = Number(devotees);

  if (trimmedName.length < 2 || trimmedName.length > 100) {
    setSubmitError("Please enter your full name.");
    setSubmitting(false);
    return;
  }
  if (!/^(?:\+91[\s-]?)?[6-9]\d{9}$/.test(trimmedMobile)) {
    setSubmitError("Please enter a valid Indian mobile number.");
    setSubmitting(false);
    return;
  }
  if (trimmedEmail && !/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
    setSubmitError("Please enter a valid email address.");
    setSubmitting(false);
    return;
  }
  if (!date || date < today) {
    setSubmitError("Please choose today or a future Pooja date.");
    setSubmitting(false);
    return;
  }
  if (!/^\d{2}:\d{2}$/.test(time)) {
    setSubmitError("Please choose a valid Pooja time.");
    setSubmitting(false);
    return;
  }
  if (!Number.isInteger(devoteeCount) || devoteeCount < 1 || devoteeCount > 50) {
    setSubmitError("Please enter between 1 and 50 devotees.");
    setSubmitting(false);
    return;
  }

  console.log("DIVYAARPAN: saveBooking() CALLED");

  const bookingData = {
    templeId: selectedTemple.id,
    poojaId: selectedPooja.id,

    poojaMode,

    name: trimmedName,

    mobile: trimmedMobile,

    email: trimmedEmail,

    date,

    time,

    devotees: String(devoteeCount),

    sankalp,

  };


  try {

    const response = await fetch("/api/bookings", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(bookingData),

    });


    const result = await response.json().catch(() => null);


    if (response.ok && result?.success && result.booking?.bookingId) {

      window.location.href =
      `/checkout?bookingId=${encodeURIComponent(result.booking.bookingId)}`;

    } else {

      setSubmitError(result?.error || "Booking could not be created. Please try again.");

    }


  } catch (error) {

    console.error(error);

    setSubmitError("Something went wrong while creating your booking. Please try again.");

  } finally {
    setSubmitting(false);
  }

};





  if (loadError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fff9f3] px-6">
        <div className="text-center" role="alert">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-3xl text-red-600">!</div>
          <p className="mt-5 text-sm font-bold uppercase tracking-[0.22em] text-[#f45112]">DivyaArpan</p>
          <h1 className="mt-3 font-serif text-3xl font-bold text-[#10264b]">Pooja booking is unavailable</h1>
          <p className="mt-2 text-slate-500">{loadError}</p>
          <Link href="/temples" className="mt-6 inline-flex rounded-xl bg-[#f45112] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#d9430b]">Browse Temples</Link>
        </div>
      </main>
    );
  }

  if (!selectedTemple || !selectedPooja || !temples) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fff9f3] px-6">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-3xl">
            🪷
          </div>
          <p className="mt-5 text-sm font-bold uppercase tracking-[0.22em] text-[#f45112]">DivyaArpan</p>
          <h1 className="mt-3 font-serif text-3xl font-bold text-[#10264b]">Loading Your Pooja Options</h1>
          <p className="mt-2 text-slate-500">Please wait while we load available temples and poojas.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff9f3]">
      <section className="mx-auto max-w-6xl px-5 py-6 md:px-8 md:py-8">

        {/* DIVYAARPAN BRAND HEADER */}
        <div className="mx-auto max-w-4xl text-center">

          <div className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 text-xl shadow-sm">
              🪷
            </div>

            <div className="text-left">
              <p className="font-serif text-2xl font-bold leading-none text-[#f45112]">
                DivyaArpan
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Pooja Services
              </p>
            </div>
          </div>

          <h1 className="mt-5 font-serif text-4xl font-bold tracking-tight text-[#10264b] md:text-5xl">
            {poojaMode === "ON_BEHALF"
              ? "Ghar Se Pooja"
              : poojaMode === "AT_HOME"
                ? "Ghar Mein Pooja"
                : "Mandir Mein Pooja"}
          </h1>

          <p className="mx-auto mt-2 text-base font-semibold text-[#10264b] md:text-lg">
            Aap bhakti kijiye. Baaki hum sambhalenge.
          </p>

          <p className="mx-auto mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            {poojaMode === "ON_BEHALF"
              ? "Pooja aapki taraf se hum karayenge, with required Samagri and trusted Pandit coordination."
              : poojaMode === "AT_HOME"
                ? "Trusted Pandit aapke ghar par Pooja karayenge, with required Samagri and coordination."
                : "Aap mandir jaiye. Pooja ki taiyari, required Samagri and trusted Pandit coordination hum sambhalenge."}
          </p>

        </div>

        {/* BOOKING JOURNEY */}
        <div className="mx-auto mt-5 max-w-4xl px-2">
          <div className="flex items-center justify-center">

            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f45112] text-xs font-bold text-white">
                1
              </div>
              <span className="text-xs font-semibold text-[#f45112] md:text-sm">
                Pooja
              </span>
            </div>

            <div className="mx-3 h-px w-8 bg-orange-200 md:mx-5 md:w-14" />

            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-50 text-xs font-semibold text-orange-500">
                2
              </div>
              <span className="text-xs font-medium text-slate-500 md:text-sm">
                Details
              </span>
            </div>

            <div className="mx-3 h-px w-8 bg-orange-200 md:mx-5 md:w-14" />

            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-50 text-xs font-semibold text-orange-500">
                3
              </div>
              <span className="text-xs font-medium text-slate-500 md:text-sm">
                Review
              </span>
            </div>

            <div className="mx-3 h-px w-8 bg-orange-200 md:mx-5 md:w-14" />

            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-50 text-xs font-semibold text-orange-500">
                4
              </div>
              <span className="text-xs font-medium text-slate-500 md:text-sm">
                Payment
              </span>
            </div>

          </div>
        </div>

        {/* MAIN FORM */}
        <div className="mt-5 grid gap-5 lg:grid-cols-2">

          {/* YOUR POOJA */}
          <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-[0_15px_45px_rgba(80,40,10,0.07)] md:p-8">

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-xl">
                🛕
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-500">
                  Step 1
                </p>

                <h2 className="mt-1 font-serif text-2xl font-bold text-[#10264b]">
                  Your Pooja
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Choose where and which Pooja you would like to arrange.
                </p>
              </div>
            </div>

            <div className="mt-7">
              <label className="mb-2 block text-sm font-semibold text-[#10264b]">
                Temple
              </label>

              <select
                value={selectedTemple.id}
                onChange={(e) => {
                  const temple =
                    temples.find((item) => String(item.id) === e.target.value) ||
                    temples[0];

                  setSelectedTemple(temple);
                  setSelectedPooja(temple.poojas[0]);
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-slate-800 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-50"
              >
                {temples.map((temple) => (
                  <option key={temple.id} value={temple.id}>
                    {temple.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-[#10264b]">
                Pooja
              </label>

              <select
                value={selectedPooja.id}
                onChange={(e) => {
                  const pooja = selectedTemple.poojas.find(
                    (item) => item.name === e.target.value
                  );

                  if (pooja) {
                    setSelectedPooja(pooja);
                  }
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-slate-800 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-50"
              >
                {selectedTemple.poojas.map((pooja) => (
                  <option key={pooja.name}>
                    {pooja.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#10264b]">
                  Preferred Date
                </label>

                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().slice(0, 10)}
                  required
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#10264b]">
                  Preferred Time
                </label>

                <input
                  type="time"
                  value={time}
                  required
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-50"
                />
              </div>

            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-[#10264b]">
                Number of Devotees
              </label>

              <input
                type="number"
                min="1"
                max="50"
                required
                value={devotees}
                onChange={(e) => setDevotees(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-50"
              />
            </div>

          </div>

          {/* YOUR DETAILS */}
          <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-[0_15px_45px_rgba(80,40,10,0.07)] md:p-8">

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-xl">
                🙏
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-500">
                  Step 2
                </p>

                <h2 className="mt-1 font-serif text-2xl font-bold text-[#10264b]">
                  Your Details
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Just a few details so we can keep your Pooja booking clear and connected.
                </p>
              </div>
            </div>

            <div className="mt-7">
              <label className="mb-2 block text-sm font-semibold text-[#10264b]">
                Devotee Name
              </label>

              <input
                type="text"
                value={name}
                required
                minLength={2}
                maxLength={100}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-50"
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-[#10264b]">
                Mobile Number
              </label>

              <input
                type="tel"
                value={mobile}
                required
                pattern="(?:\+91[\s-]?)?[6-9][0-9]{9}"
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter mobile number"
                className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-50"
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-[#10264b]">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-50"
              />
            </div>

            {/* SANKALP */}
            <div className="mt-6 rounded-2xl border border-orange-100 bg-[#fff9f3] p-5">

              <div className="flex items-center gap-3">
                <span className="text-xl">🪷</span>

                <div>
                  <h3 className="font-semibold text-[#10264b]">
                    Your Sankalp / Prayer
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Optional — share what is in your heart.
                  </p>
                </div>
              </div>

              <textarea
                value={sankalp}
                onChange={(e) => setSankalp(e.target.value)}
                placeholder="Write your prayer or sankalp..."
                rows={4}
                className="mt-4 w-full resize-none rounded-xl border border-orange-100 bg-white px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-50"
              />

            </div>

          </div>
        </div>

        {/* REVIEW */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-[0_15px_45px_rgba(80,40,10,0.07)]">

          <div className="border-b border-orange-100 bg-[#fff4e8] px-6 py-5 md:px-8">

            <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-500">
              Step 3
            </p>

            <div className="mt-1 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
              <h2 className="font-serif text-2xl font-bold text-[#10264b]">
                Review Your Pooja
              </h2>

              <span className="text-sm text-slate-500">
                Booking reference will be assigned securely after submission
              </span>
            </div>

          </div>

          <div className="grid gap-4 p-6 md:grid-cols-2 md:p-8 lg:grid-cols-4">

            <div className="rounded-2xl bg-[#fff9f3] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Temple
              </p>
              <p className="mt-1 font-semibold text-[#10264b]">
                {selectedTemple.name}
              </p>
            </div>

            <div className="rounded-2xl bg-[#fff9f3] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Pooja
              </p>
              <p className="mt-1 font-semibold text-[#10264b]">
                {selectedPooja.name}
              </p>
            </div>

            <div className="rounded-2xl bg-[#fff9f3] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Duration
              </p>
              <p className="mt-1 font-semibold text-[#10264b]">
                {selectedPooja.duration}
              </p>
            </div>

            <div className="rounded-2xl bg-orange-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">
                Pooja Price
              </p>
              <p className="mt-1 text-xl font-bold text-[#f45112]">
                {selectedPooja.price}
              </p>
            </div>

          </div>

          {/* FINAL REASSURANCE + CTA */}
          <div className="border-t border-orange-100 px-6 py-6 md:px-8">

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-start gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 text-lg">
                  🪷
                </div>

                <div>
                  <p className="font-semibold text-[#10264b]">
                    Aap bhakti kijiye. Baaki hum sambhalenge.
                  </p>

                  <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                    DivyaArpan coordinates the required Samagri, Pooja arrangements
                    and trusted Pandit coordination for your selected Pooja.
                  </p>
                </div>

              </div>

              <button
                type="button"
                disabled={submitting}
                onClick={saveBooking}
                className="inline-flex min-h-[54px] items-center justify-center rounded-xl bg-[#f45112] px-8 text-base font-bold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-[#e94b00] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Creating Booking..." : "Continue to Checkout"}
                <span className="ml-2 text-lg">→</span>
              </button>

            </div>
            {submitError && <p role="alert" className="mt-4 text-right text-sm font-semibold text-red-600">{submitError}</p>}
          </div>

        </div>

        {/* QUIET TRUST MESSAGE */}
        <div className="mx-auto mt-6 flex max-w-3xl items-center justify-center gap-2 text-center text-sm text-slate-500">
          <span>🔒</span>
          <span>Your details are used only to arrange and confirm your Pooja.</span>
        </div>

      </section>
    </main>
  )


}

export default function Booking() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#fffaf5] flex items-center justify-center px-6">
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-700">
              Loading booking...
            </p>
          </div>
        </main>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
