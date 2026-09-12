"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

type TempleBooking = {
  bookingId: string;
  temple: string;
  pooja: string;
  price: string;
  duration: string;
  name: string;
  mobile: string;
  email: string;
  date: string;
  time: string;
  devotees: number;
  sankalp: string | null;
  status: string;
  paymentStatus: string;
  amount: number | null;
  paymentOrderId: string | null;
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
    type: string;
  };
  handler: (response: RazorpayPaymentResponse) => void;
  modal: {
    ondismiss: () => void;
  };
  theme: {
    color: string;
  };
};

export default function Payment() {
  const [booking, setBooking] =
    useState<TempleBooking | null>(null);

  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] =
    useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const params = new URLSearchParams(
          window.location.search
        );

        const bookingId = params.get("bookingId");

        if (!bookingId) {
          setError("Booking ID is missing.");
          return;
        }

        const response = await fetch(
          `/api/bookings/${encodeURIComponent(bookingId)}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error ||
              "Unable to load booking details."
          );
        }

        setBooking(data.booking);
      } catch (err) {
        console.error(
          "TEMPLE PAYMENT LOAD ERROR:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load booking details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, []);

  const handlePayment = async () => {
    if (!booking) return;

    if (booking.paymentStatus === "PAID") {
      window.location.href =
        `/success?bookingId=${encodeURIComponent(
          booking.bookingId
        )}`;

      return;
    }

    try {
      setPaymentLoading(true);
      setError("");

      const response = await fetch(
        "/api/payments/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId: booking.bookingId,
            type: "temple",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Unable to create payment order."
        );
      }

      if (!window.Razorpay) {
        throw new Error(
          "Payment gateway is still loading. Please try again."
        );
      }

      const options: RazorpayOptions = {
        key: data.keyId,

        amount: data.order.amount,

        currency: data.order.currency,

        name: "DivyaDarpan",

        description: `${booking.temple} - ${booking.pooja}`,

        order_id: data.order.id,

        prefill: {
          name: booking.name,
          contact: booking.mobile,
          email: booking.email || "",
        },

        notes: {
          bookingId: booking.bookingId,
          type: "temple",
        },

        handler: async function (
          paymentResponse: RazorpayPaymentResponse
        ) {
          try {
            setError("");

            const verifyResponse =
              await fetch(
                "/api/payments/verify",
                {
                  method: "POST",
                  headers: {
                    "Content-Type":
                      "application/json",
                  },
                  body: JSON.stringify({
                    bookingId:
                      booking.bookingId,
                    type: "temple",
                    razorpay_order_id:
                      paymentResponse.razorpay_order_id,
                    razorpay_payment_id:
                      paymentResponse.razorpay_payment_id,
                    razorpay_signature:
                      paymentResponse.razorpay_signature,
                  }),
                }
              );

            const verifyData =
              await verifyResponse.json();

            if (
              !verifyResponse.ok ||
              !verifyData.success
            ) {
              throw new Error(
                verifyData.error ||
                  "Payment verification failed."
              );
            }

            window.location.href =
              `/success?bookingId=${encodeURIComponent(
                booking.bookingId
              )}`;
          } catch (err) {
            console.error(
              "TEMPLE PAYMENT VERIFICATION ERROR:",
              err
            );

            setError(
              err instanceof Error
                ? err.message
                : "Payment verification failed."
            );

            setPaymentLoading(false);
          }
        },

        modal: {
          ondismiss: function () {
            setPaymentLoading(false);
          },
        },

        theme: {
          color: "#ea580c",
        },
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function () {
          console.error(
            "TEMPLE RAZORPAY PAYMENT FAILED"
          );

          setPaymentLoading(false);

          window.location.href =
            `/payment/failed?bookingId=${encodeURIComponent(
              booking.bookingId
            )}`;
        }
      );

      razorpay.open();
    } catch (err) {
      console.error(
        "TEMPLE PAYMENT ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to start payment."
      );

      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-orange-50 flex items-center justify-center">
        <h1 className="text-2xl font-bold text-orange-700">
          Loading Payment Details...
        </h1>
      </main>
    );
  }

  if (error && !booking) {
    return (
      <main className="min-h-screen bg-orange-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-lg w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Unable to Load Payment
          </h1>

          <p className="text-gray-700">
            {error}
          </p>
        </div>
      </main>
    );
  }

  if (!booking) return null;

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />

      <main className="min-h-screen bg-orange-50 py-16 px-6">
        <section className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h1 className="text-4xl font-bold text-center text-orange-700 mb-8">
              Secure Payment
            </h1>

            <div className="bg-orange-100 rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold mb-5">
                Booking Summary
              </h2>

              <p className="mb-3">
                🆔{" "}
                <strong>
                  {booking.bookingId}
                </strong>
              </p>

              <p className="mb-3">
                🛕 {booking.temple}
              </p>

              <p className="mb-3">
                🙏 {booking.pooja}
              </p>

              <p className="mb-3">
                📅 {booking.date}
              </p>

              <p className="mb-3">
                🕐 {booking.time}
              </p>

              <p className="mb-3">
                👥 {booking.devotees}
              </p>

              <p className="mb-3">
                💰{" "}
                <strong>
                  {booking.price}
                </strong>
              </p>

              <p className="text-orange-700 font-semibold">
                Payment Pending
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">
                {error}
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={paymentLoading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl text-lg font-semibold disabled:bg-orange-400"
            >
              {paymentLoading
                ? "Opening Secure Payment..."
                : `Pay ${booking.price}`}
            </button>

            {paymentLoading && (
              <div className="mt-8 text-center">
                <div className="mx-auto h-12 w-12 rounded-full border-4 border-orange-600 border-t-transparent animate-spin" />

                <h3 className="mt-5 text-xl font-bold text-orange-700">
                  Opening Secure Payment
                </h3>

                <p className="text-gray-500 mt-2">
                  Please wait...
                </p>
              </div>
            )}

            <p className="text-center text-sm text-gray-500 mt-6">
              Secure payment powered by Razorpay
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
