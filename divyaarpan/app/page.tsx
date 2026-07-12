export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-orange-50">
      <h1 className="text-5xl font-bold text-orange-700">
        🛕 Welcome to DivyaArpan
      </h1>

      <p className="mt-6 text-xl text-gray-700">
        Your Digital Devotional Platform
      </p>

      <button className="mt-8 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700">
        Explore Temples
      </button>
    </main>
  );
}