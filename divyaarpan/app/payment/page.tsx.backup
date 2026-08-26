"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Payment() {

  const router = useRouter();

  const [booking, setBooking] = useState<any>(null);

  const [paymentMethod, setPaymentMethod] = useState("");

  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const loadBooking = async () => {

  const params = new URLSearchParams(window.location.search);

  const bookingId = params.get("bookingId");

  if (!bookingId) return;


  const response = await fetch(
    `/api/bookings/${bookingId}`
  );


  const data = await response.json();


  if (data.success) {
    setBooking(data.booking);
  }

};


loadBooking();

    

  }, []);

  if (!booking) {

    return (

      <main className="min-h-screen bg-orange-50 flex items-center justify-center">

        <h1 className="text-2xl font-bold text-orange-700">

          Loading Payment Details...

        </h1>

      </main>

    );

  }

  const handlePayment = async () => {

    if (!paymentMethod) {

      alert("Please select a payment method.");

      return;

    }

    setProcessing(true);

    await fetch("/api/bookings/update", {

  method: "PUT",

  headers: {
    "Content-Type": "application/json",
  },

  body: JSON.stringify({

    bookingId: booking.bookingId,

  }),

});

    setTimeout(() => {

      router.push(`/success?bookingId=${booking.bookingId}`);

    }, 3000);

  };

  return (

    <main className="min-h-screen bg-orange-50 py-16 px-6">

      <section className="max-w-2xl mx-auto">

        <div className="bg-white rounded-xl shadow-xl p-8">

          <h1 className="text-4xl font-bold text-center text-orange-700 mb-8">

            Secure Payment

          </h1>

          {/* Booking Summary */}

          <div className="bg-orange-100 rounded-xl p-6 mb-8">

            <h2 className="text-2xl font-bold mb-5">

              Booking Summary

            </h2>

            <p className="mb-3">
              🆔 <strong>{booking.bookingId}</strong>
            </p>

            <p className="mb-3">
              🛕 {booking.temple}
            </p>

            <p className="mb-3">
              🙏 {booking.pooja}
            </p>

            <p className="mb-3">
              💰 <strong>{booking.price}</strong>
            </p>

            <p className="text-orange-700 font-semibold">

              Payment Pending

            </p>

          </div>

          {/* Payment Methods */}

          <h2 className="text-2xl font-bold mb-5">

            Select Payment Method

          </h2>

          <div className="space-y-4">

            <label className="border rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:border-orange-500">

              <input
                type="radio"
                name="payment"
                value="UPI"
                checked={paymentMethod === "UPI"}
                onChange={(e) =>
                  setPaymentMethod(e.target.value)
                }
              />

              <span className="text-lg">
                💳 UPI
              </span>

            </label>

            <label className="border rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:border-orange-500">

              <input
                type="radio"
                name="payment"
                value="Credit / Debit Card"
                checked={paymentMethod === "Credit / Debit Card"}
                onChange={(e) =>
                  setPaymentMethod(e.target.value)
                }
              />

              <span className="text-lg">
                💳 Credit / Debit Card
              </span>

            </label>

            <label className="border rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:border-orange-500">

              <input
                type="radio"
                name="payment"
                value="Net Banking"
                checked={paymentMethod === "Net Banking"}
                onChange={(e) =>
                  setPaymentMethod(e.target.value)
                }
              />

              <span className="text-lg">
                🏦 Net Banking
              </span>

            </label>

          </div>

          <button

            onClick={handlePayment}

            disabled={processing}

            className="mt-8 w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl text-lg font-semibold disabled:bg-orange-400"

          >

            {processing ? "Processing Payment..." : "Pay Now"}

          </button>

          {processing && (

            <div className="mt-10 text-center">

              <div className="mx-auto h-16 w-16 rounded-full border-4 border-orange-600 border-t-transparent animate-spin"></div>

              <h3 className="mt-6 text-xl font-bold text-orange-700">

                Processing Your Payment

              </h3>

              <p className="text-gray-500 mt-2">

                Please wait...

                <br />

                Do not refresh or close this page.

              </p>

            </div>

          )}

        </div>

      </section>

    </main>

  );

}