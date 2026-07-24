import Link from "next/link";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function AdminPoojasPage() {
  const poojas = await prisma.pooja.findMany({
    include: {
      temple: true,
    },
    orderBy: {
      createdAt: "desc",
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
                Manage Poojas
              </h1>

              <p className="mt-2 text-orange-100">
                Manage temple poojas, pricing and availability.
              </p>
            </div>

            <Link
              href="/admin/poojas/new"
              className="bg-white text-orange-700 font-semibold px-6 py-3 rounded-xl hover:bg-orange-50 transition"
            >
              + Add New Pooja
            </Link>
          </div>
        </div>
      </section>

      {/* Pooja List */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Poojas
          </h2>

          <span className="text-gray-600">
            Total: {poojas.length}
          </span>
        </div>

        {poojas.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <div className="text-5xl mb-4">
              🙏
            </div>

            <h3 className="text-xl font-bold">
              No Poojas Found
            </h3>

            <p className="text-gray-500 mt-2">
              Add the first pooja to a temple.
            </p>

            <Link
              href="/admin/poojas/new"
              className="inline-block mt-6 bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700"
            >
              + Add New Pooja
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {poojas.map((pooja) => (
              <div
                key={pooja.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden"
              >
                {pooja.image && (
                  <img
                    src={pooja.image}
                    alt={pooja.name}
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-6">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-xl font-bold text-orange-700">
                      {pooja.name}
                    </h3>

                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        pooja.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {pooja.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <p className="text-gray-600 mt-3 font-medium">
                    🛕 {pooja.temple.name}
                  </p>

                  <p className="text-gray-500 mt-3">
                    {pooja.description}
                  </p>

                  <div className="border-t mt-5 pt-5 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Price
                      </span>

                      <span className="font-bold text-green-700">
                        ₹{pooja.price}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Duration
                      </span>

                      <span className="font-semibold">
                        {pooja.duration}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Link
                      href={`/temples/${pooja.temple.slug}`}
                      className="flex-1 border border-orange-600 text-orange-700 text-center py-2 rounded-lg hover:bg-orange-50"
                    >
                      View Temple
                    </Link>

                    <Link
                      href={`/admin/poojas/${pooja.id}/edit`}
                      className="flex-1 bg-orange-600 text-white text-center py-2 rounded-lg hover:bg-orange-700"
                    >
                      Edit
                    </Link>
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