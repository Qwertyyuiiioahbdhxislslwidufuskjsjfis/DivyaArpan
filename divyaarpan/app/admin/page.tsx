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
      title: "Manage Pandits",
      description:
        "Add, verify and manage Pandits, services, languages and availability.",
      icon: "🧘",
      href: "/admin/pandits",
      available: true,
      highlight: true,
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
      title: "Pandit Bookings",
      description:
        "Manage immediate and scheduled Pandit requests, assignments and booking status.",
      icon: "⚡",
      href: "/admin/pandit-bookings",
      available: false,
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
      available: true,
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
      <section className="bg-gradient-to-r from-orange-800 via-orange-700 to-amber-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <p className="text-orange-100 font-semibold tracking-wide">
            DIVYAARPAN ADMIN
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mt-2">
            Admin Dashboard
          </h1>

          <p className="mt-4 text-orange-100 max-w-2xl text-lg">
            Manage temples, poojas, Pandits, bookings and devotional
            services from one place.
          </p>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="max-w-6xl mx-auto px-6 -mt-6 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-md p-5">
            <p className="text-sm text-gray-500">Temple Network</p>
            <p className="mt-1 font-bold text-gray-900">
              Manage Temples
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5">
            <p className="text-sm text-gray-500">Pooja Services</p>
            <p className="mt-1 font-bold text-gray-900">
              Manage Poojas
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5 border border-orange-200">
            <p className="text-sm text-orange-600">
              Pandit Network
            </p>
            <p className="mt-1 font-bold text-gray-900">
              Marketplace
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5">
            <p className="text-sm text-gray-500">
              Operations
            </p>
            <p className="mt-1 font-bold text-gray-900">
              Bookings
            </p>
          </div>
        </div>
      </section>

      {/* Management */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="mb-8">
          <p className="text-orange-600 font-semibold">
            CONTROL CENTER
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            Management
          </h2>

          <p className="text-gray-600 mt-2">
            Select a section to manage DivyaArpan operations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {managementCards.map((card) => {
            const cardContent = (
              <div
                className={`rounded-2xl p-8 h-full transition-all duration-300 ${
                  card.highlight
                    ? "bg-gradient-to-br from-orange-600 to-orange-700 text-white shadow-xl hover:-translate-y-1"
                    : "bg-white shadow-md hover:shadow-xl hover:-translate-y-1"
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-5 ${
                    card.highlight
                      ? "bg-white/15"
                      : "bg-orange-50"
                  }`}
                >
                  {card.icon}
                </div>

                <h3
                  className={`text-xl font-bold ${
                    card.highlight
                      ? "text-white"
                      : "text-orange-700"
                  }`}
                >
                  {card.title}
                </h3>

                <p
                  className={`mt-3 leading-relaxed ${
                    card.highlight
                      ? "text-orange-100"
                      : "text-gray-600"
                  }`}
                >
                  {card.description}
                </p>

                {card.available ? (
                  <p
                    className={`mt-6 font-semibold ${
                      card.highlight
                        ? "text-white"
                        : "text-orange-600"
                    }`}
                  >
                    Open →
                  </p>
                ) : (
                  <p
                    className={`mt-6 text-sm ${
                      card.highlight
                        ? "text-orange-200"
                        : "text-gray-400"
                    }`}
                  >
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