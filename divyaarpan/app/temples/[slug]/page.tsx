import Link from "next/link";
import TempleGallery from "../../components/TempleGallery";
import TempleMap from "../../components/TempleMap";
import TemplePoojas from "../../components/TemplePoojas";

type Temple = {
  id: number;
  slug: string;
  name: string;
  city: string;
  state: string;
  address: string;
  description: string;
  openingTime: string;
  closingTime: string;
  mapUrl: string;
  featuredImage: string;
  facilities: {
    facility: string;
  }[];
  galleries: {
    imageUrl: string;
  }[];
  poojas: {
    name: string;
    price: string;
    duration: string;
  }[];
};

async function getTemple(slug: string): Promise<Temple> {
  const res = await fetch(
    `http://localhost:3000/api/temples/${slug}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Temple not found");
  }

  return res.json();
}

export default async function TemplePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const temple = await getTemple(slug);

  return (
    <main className="min-h-screen bg-orange-50">
      <section className="max-w-6xl mx-auto py-16 px-6">
        <img
          src={temple.featuredImage}
          alt={temple.name}
          className="w-full h-96 object-cover rounded-xl shadow-lg"
        />

        <h1 className="text-5xl font-bold text-orange-700 mt-8">
          {temple.name}
        </h1>

        <p className="text-gray-600 mt-3 text-lg">
          {temple.city}, {temple.state}
        </p>

        <p className="mt-8 text-gray-700 leading-8">
          {temple.description}
        </p>

        <TempleGallery
          images={temple.galleries.map((g) => g.imageUrl)}
        />

        <TempleMap
          location={temple.mapUrl}
        />

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">
              Temple Timings
            </h2>

            <p>🕔 Opening : {temple.openingTime}</p>

            <p>🌙 Closing : {temple.closingTime}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">
              Facilities
            </h2>

            <ul className="space-y-2">
              {temple.facilities.map((facility) => (
                <li key={facility.facility}>
                  {facility.facility}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <TemplePoojas
          poojas={temple.poojas}
          templeName={temple.name}
        />

        <div className="mt-12 flex justify-center">
          <Link
            href={`/booking?temple=${encodeURIComponent(
              temple.name
            )}&pooja=${encodeURIComponent(
              temple.poojas[0]?.name ?? ""
            )}`}
            className="bg-orange-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-orange-700 transition"
          >
            Book {temple.poojas[0]?.name ?? "Pooja"}
          </Link>
        </div>
      </section>
    </main>
  );
}