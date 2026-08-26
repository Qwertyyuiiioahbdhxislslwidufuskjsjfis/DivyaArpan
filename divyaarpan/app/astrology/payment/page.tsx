"use client";

import Script from "next/script";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type AstrologyBooking = {
  bookingId: string;
  service: string;
  consultationMode: string;
  name: string;
  mobile: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  amount: number;
  status: string;
  paymentStatus: string;
};

type RazorpayPaymentResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    contact: string;
    email: string;
  };
  notes: {
    bookingId: string;
  };
  handler: (response: RazorpayPaymentResponse) => void;
  modal: {
    ondismiss: () => void;
  };
  theme: {
    color: string;
  };
};

type RazorpayInstance = {
  open: () => void;
  on: (event: string, callback: (response?: unknown) => void) => void;
};

type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

function AstrologyPaymentPageContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const [booking, setBooking] = useState<AstrologyBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    async function fetchBooking() {
      if (!bookingId) {
        setError("Booking ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/astrology-bookings/${encodeURIComponent(bookingId)}`, {
          cache: "no-store",
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load consultation booking.");
        setBooking(data.booking);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load consultation booking.");
      } finally {
        setLoading(false);
      }
    }

    void fetchBooking();
  }, [bookingId]);

  async function handlePayment() {
    if (!booking) return;

    try {
      setPaymentLoading(true);
      setError("");

      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking.bookingId, type: "astrology" }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Unable to create payment order.");

      if (!window.Razorpay) throw new Error("Payment gateway is loading. Please try again.");

      const options: RazorpayOptions = {
        key: data.keyId,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "DivyaArpan Astrology",
        description: booking.service,
        order_id: data.order.id,
        prefill: {
          name: booking.name,
          contact: booking.mobile,
          email: booking.email,
        },
        notes: {
          bookingId: booking.bookingId,
        },
        handler: async (paymentResponse: RazorpayPaymentResponse) => {
          try {
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                bookingId: booking.bookingId,
                type: "astrology",
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              }),
            });
            const verify = await verifyResponse.json();
            if (!verifyResponse.ok || !verify.success) throw new Error(verify.error || "Payment verification failed.");
            window.location.href = `/astrology/payment/success?bookingId=${encodeURIComponent(booking.bookingId)}`;
          } catch (verifyError) {
            setError(verifyError instanceof Error ? verifyError.message : "Payment verification failed.");
            setPaymentLoading(false);
          }
        },
        modal: {
          ondismiss: () => setPaymentLoading(false),
        },
        theme: {
          color: "#ea580c",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", () => {
        window.location.href = `/astrology/payment/failed?bookingId=${encodeURIComponent(booking.bookingId)}`;
      });
      razorpay.open();
    } catch (paymentError) {
      setError(paymentError instanceof Error ? paymentError.message : "Unable to start payment.");
      setPaymentLoading(false);
    }
  }

  if (loading) {
    return <main className="min-h-screen bg-orange-50 flex items-center justify-center"><p className="text-xl font-semibold text-orange-700">Loading consultation payment...</p></main>;
  }

  if (!booking) {
    return <main className="min-h-screen bg-orange-50 px-6 py-16"><div className="mx-auto max-w-2xl rounded-2xl bg-white p-10 text-center shadow-lg"><h1 className="text-3xl font-bold text-red-600">Unable to load consultation booking</h1><p className="mt-3 text-slate-600">{error}</p><Link href="/astrology/booking" className="mt-7 inline-block rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white">Back to Astrology Booking</Link></div></main>;
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <main className="min-h-screen bg-orange-50 py-14 px-6">
        <section className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-orange-700">Astrology Consultation Payment</h1>
          <p className="mt-2 text-slate-600">Complete your payment to confirm your astrology consultation slot.</p>

          <div className="mt-8 rounded-xl bg-orange-50 p-6">
            <p><strong>Booking ID:</strong> {booking.bookingId}</p>
            <p className="mt-2"><strong>Service:</strong> {booking.service}</p>
            <p className="mt-2"><strong>Consultation Mode:</strong> {booking.consultationMode === "VIDEO_CALL" ? "Video Call" : "Phone Call"}</p>
            <p className="mt-2"><strong>Preferred Slot:</strong> {booking.preferredDate} at {booking.preferredTime}</p>
            <p className="mt-2"><strong>Amount:</strong> ₹{(booking.amount / 100).toLocaleString("en-IN")}</p>
            <p className="mt-2"><strong>Payment Status:</strong> {booking.paymentStatus}</p>
          </div>

          {error && <p role="alert" className="mt-5 text-sm font-semibold text-red-600">{error}</p>}

          <button onClick={handlePayment} disabled={paymentLoading || booking.paymentStatus === "PAID"} className="mt-7 w-full rounded-xl bg-orange-600 px-6 py-3.5 font-bold text-white hover:bg-orange-700 disabled:opacity-60">
            {booking.paymentStatus === "PAID" ? "Already Paid" : paymentLoading ? "Opening secure payment..." : "Pay Securely"}
          </button>
        </section>
      </main>
    </>
  );
}

export default function AstrologyPaymentPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-orange-50" />}>
      <AstrologyPaymentPageContent />
    </Suspense>
  );
}
