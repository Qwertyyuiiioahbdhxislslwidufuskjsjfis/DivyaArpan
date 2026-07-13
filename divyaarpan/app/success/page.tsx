import Link from "next/link";

export default function Success() {
  return (
    <main className="min-h-screen bg-orange-50 flex items-center justify-center px-6">
      <div className="bg-white shadow-xl rounded-xl p-10 max-w-xl w-full text-center">

        <div className="text-6xl mb-4">🎉</div>

        <h1 className="text-4xl font-bold text-green-600 mb-4">
          Booking Successful!
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for booking your pooja with DivyaArpan.
        </p>

        <div className="bg-orange-100 rounded-lg p-5 text-left mb-8">
          <p><strong>Booking ID:</strong> DA20260001</p>
          <p><strong>Status:</strong> Confirmed</p>
          <p><strong>Payment:</strong> Successful</p>
        </div>

        <Link
          href="/"
          className="inline-block bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700"
        >
          Back to Home
        </Link>

      </div>
    </main>
  );
}