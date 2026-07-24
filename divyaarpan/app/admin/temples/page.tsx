import Link from "next/link";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function AdminTemplesPage() {
  const temples = await prisma.temple.findMany({
    include: {
      poojas: true,
      galleries: true,
      facilities: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-orange-50">
      {/* Header */}
      <section className="bg-orange-700 text-white">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <Link
            href="/admin"
            className="text-orange-100 hover:text-white"
          >
            ← Back to Dashboard
          </Link>

          <div className="mt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold">
                Manage Temples
              </h1>

              <p className="mt-2 text-orange-100">
                Add, edit and manage temples on DivyaArpan.
              </p>
            </div>

            <Link
              href="/admin/temples/new"
              className="bg-white text-orange-700 font-semibold px-6 py-3 rounded-xl hover:bg-orange-50 transition"
            >
              + Add New Temple
            </Link>
          </div>
        </div>
      </section>

      {/* Temple List */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Temples
          </h2>

          <span className="text-gray-600">
            Total: {temples.length}
          </span>
        </div>

        {temples.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <p className="text-xl font-semibold">
              No temples found
            </p>

            <p className="text-gray-500 mt-2">
              Add your first temple to DivyaArpan.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {temples.map((temple) => (
              <div
                key={temple.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden"
              >
                <div className="md:flex">
                  <img
                    src={temple.featuredImage}
                    alt={temple.name}
                    className="w-full md:w-64 h-52 object-cover"
                  />

                  <div className="p-6 flex-1">
                    <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
                      <div>
                        <h3 className="text-2xl font-bold text-orange-700">
                          {temple.name}
                        </h3>

                        <p className="text-gray-600 mt-2">
                          📍 {temple.city}, {temple.state}
                        </p>

                        <div className="flex flex-wrap gap-4 mt-5 text-sm text-gray-600">
                          <span>
                            🙏 {temple.poojas.length} Poojas
                          </span>

                          <span>
                            🖼️ {temple.galleries.length} Images
                          </span>

                          <span>
                            🏛️ {temple.facilities.length} Facilities
                          </span>
                        </div>

                        {temple.isFeatured && (
                          <span className="inline-block mt-4 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                            Featured Temple
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap lg:flex-col gap-3">
                        <Link
                          href={`/temples/${temple.slug}`}
                          className="border border-orange-600 text-orange-700 px-5 py-2 rounded-lg text-center hover:bg-orange-50"
                        >
                          View
                        </Link>

                        <button
                          type="button"
                          className="bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-700"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}