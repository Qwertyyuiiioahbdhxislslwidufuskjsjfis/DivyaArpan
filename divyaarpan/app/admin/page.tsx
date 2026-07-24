import Link from "next/link";

export default function AdminDashboard() {
  const managementCards = [
    {
      title: "Manage Temples",
      description:
        "Add, edit and manage temples available on DivyaArpan.",
      icon: "🛕",
      href: "/admin/temples",
      available: true,
    },
    {
      title: "Manage Poojas",
      description:
        "Manage temple poojas, pricing and availability.",
      icon: "🙏",
      href: "/admin/poojas",
      available: true,
    },
    {
      title: "Bookings",
      description:
        "View and manage devotee pooja bookings.",
      icon: "📋",
      href: "/admin/bookings",
      available: true,
    },
    {
      title: "Temple Gallery",
      description:
        "Manage temple photos and gallery images.",
      icon: "🖼️",
      href: "/admin/gallery",
      available: true,
    },
    {
      title: "Facilities",
      description:
        "Manage temple facilities and visitor information.",
      icon: "🏛️",
      href: "/admin/facilities",
      available: false,
    },
    {
      title: "Devotees",
      description:
        "View and manage registered devotees.",
      icon: "👥",
      href: "/admin/devotees",
      available: false,
    },
  ];

  return (
    <main className="min-h-screen bg-orange-50">
      {/* Header */}
      <section className="bg-orange-700 text-white">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <p className="text-orange-100 font-medium">
            DivyaArpan
          </p>

          <h1 className="text-4xl font-bold mt-2">
            Admin Dashboard
          </h1>

          <p className="mt-3 text-orange-100">
            Manage temples, poojas, bookings and devotional services.
          </p>
        </div>
      </section>

      {/* Management Section */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          Management
        </h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {managementCards.map((card) => {
            const cardContent = (
              <div className="bg-white rounded-2xl shadow-md p-8 h-full hover:shadow-xl transition">
                <div className="text-4xl mb-5">
                  {card.icon}
                </div>

                <h3 className="text-xl font-bold text-orange-700">
                  {card.title}
                </h3>

                <p className="text-gray-600 mt-3 leading-relaxed">
                  {card.description}
                </p>

                {card.available ? (
                  <p className="mt-6 text-orange-600 font-semibold">
                    Open →
                  </p>
                ) : (
                  <p className="mt-6 text-gray-400 text-sm">
                    Coming next
                  </p>
                )}
              </div>
            );

            if (card.available) {
              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className="block"
                >
                  {cardContent}
                </Link>
              );
            }

            return (
              <div key={card.title}>
                {cardContent}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}