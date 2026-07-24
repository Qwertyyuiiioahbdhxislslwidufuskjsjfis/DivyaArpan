import Link from "next/link";

type Temple = {
  id: number;
  slug: string;
  name: string;
  city: string;
  state: string;
  featuredImage: string;
  description: string;
};

async function getTemples(): Promise<Temple[]> {
  const res = await fetch("http://localhost:3000/api/temples", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch temples");
  }

  return res.json();
}

export default async function Temples() {
  const temples = await getTemples();

  return (
    <main className="min-h-screen bg-orange-50">
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold text-orange-700">
          Explore Temples
        </h1>

        <p className="mt-4 text-gray-700 text-xl">
          Discover sacred temples and book devotional services
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8">
        {temples.map((temple) => (
          <div
            key={temple.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <img
              src={temple.featuredImage}
              alt={temple.name}
              className="w-full h-60 object-cover"
            />

            <div className="p-6">
              <h2 className="text-2xl font-bold text-orange-700">
                {temple.name}
              </h2>

              <p className="mt-3">
                📍 {temple.city}, {temple.state}
              </p>

              <p className="mt-4 text-gray-600 line-clamp-3">
                {temple.description}
              </p>

              <Link
                href={`/temples/${temple.slug}`}
                className="inline-block mt-6 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition"
              >
                View Temple
              </Link>
            </div>
          </div>
        ))}
      </section>  
    </main>
  );
}