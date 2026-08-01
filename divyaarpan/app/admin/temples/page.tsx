import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import DeleteTempleButton from "./DeleteTempleButton";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

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
        <div className="mx-auto max-w-6xl px-6 py-10">
          <Link
            href="/admin"
            className="text-orange-100 hover:text-white"
          >
            ← Back to Dashboard
          </Link>

          <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
              className="rounded-xl bg-white px-6 py-3 font-semibold text-orange-700 transition hover:bg-orange-50"
            >
              + Add New Temple
            </Link>
          </div>
        </div>
      </section>

      {/* Temple List */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            Temples
          </h2>

          <span className="text-gray-600">
            Total: {temples.length}
          </span>
        </div>

        {temples.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow">
            <p className="text-xl font-semibold">
              No temples found
            </p>

            <p className="mt-2 text-gray-500">
              Add your first temple to DivyaArpan.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {temples.map((temple) => (
              <div
                key={temple.id}
                className="overflow-hidden rounded-2xl bg-white shadow-md"
              >
                <div className="md:flex">
                  <img
                    src={temple.featuredImage}
                    alt={temple.name}
                    className="h-52 w-full object-cover md:w-64"
                  />

                  <div className="flex-1 p-6">
                    <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
                      {/* Temple Information */}
                      <div>
                        <h3 className="text-2xl font-bold text-orange-700">
                          {temple.name}
                        </h3>

                        <p className="mt-2 text-gray-600">
                          📍 {temple.city}, {temple.state}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-4 text-sm text-gray-600">
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
                          <span className="mt-4 inline-block rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
                            Featured Temple
                          </span>
                        )}
                      </div>

                      {/* Admin Actions */}
                      <div className="flex flex-wrap gap-3 lg:w-36 lg:flex-col">
                        {/* View */}
                        <Link
                          href={`/temples/${temple.slug}`}
                          className="rounded-lg border border-orange-600 px-5 py-2 text-center font-medium text-orange-700 transition hover:bg-orange-50"
                        >
                          View
                        </Link>

                        {/* Edit */}
                        <Link
                          href={`/admin/temples/${temple.slug}/edit`}
                          className="rounded-lg bg-orange-600 px-5 py-2 text-center font-medium text-white transition hover:bg-orange-700"
                        >
                          Edit
                        </Link>

                        {/* Delete */}
                        <DeleteTempleButton
                          slug={temple.slug}
                          templeName={temple.name}
                        />
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