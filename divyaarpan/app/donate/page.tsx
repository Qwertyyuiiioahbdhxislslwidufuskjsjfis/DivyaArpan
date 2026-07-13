export default function Donate() {
  return (
    <main className="min-h-screen bg-orange-50 py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-4xl font-bold text-orange-700 mb-6">
          Donate
        </h1>

        <p className="text-gray-600 mb-8">
          Support temples and spiritual initiatives through DivyaArpan.
        </p>

        <div className="space-y-4">

          <button className="w-full bg-orange-600 text-white py-3 rounded-lg">
            Donate ₹501
          </button>

          <button className="w-full bg-orange-600 text-white py-3 rounded-lg">
            Donate ₹1101
          </button>

          <button className="w-full bg-orange-600 text-white py-3 rounded-lg">
            Donate ₹2101
          </button>

        </div>

      </div>
    </main>
  );
}