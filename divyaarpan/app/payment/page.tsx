import Link from "next/link";
export default function Payment() {
  return (
    <main className="min-h-screen bg-orange-50 py-16 px-6">

      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-4xl font-bold text-center text-orange-700 mb-8">
          Payment
        </h1>

        <div className="bg-orange-100 rounded-lg p-6 mb-8">

          <h2 className="text-2xl font-bold mb-4">
            Booking Summary
          </h2>

          <p className="mb-2">
            Temple: <strong>Siddhivinayak Temple</strong>
          </p>

          <p className="mb-2">
            Pooja: <strong>Ganesh Pooja</strong>
          </p>

          <p className="mb-2">
            Devotee: <strong>Chandraprakash Shukla</strong>
          </p>

          <p className="mb-2">
            Booking Fee: <strong>₹501</strong>
          </p>

        </div>

        <h2 className="text-2xl font-bold mb-4">
          Select Payment Method
        </h2>

        <div className="space-y-4">

          <label className="flex items-center gap-3">
            <input type="radio" name="payment" />
            UPI
          </label>

          <label className="flex items-center gap-3">
            <input type="radio" name="payment" />
            Credit / Debit Card
          </label>

          <label className="flex items-center gap-3">
            <input type="radio" name="payment" />
            Net Banking
          </label>

        </div>

        <Link
  href="/success"
  className="block mt-8 w-full text-center bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700"
>
  Pay Now
</Link>

      </div>

    </main>
  );
}