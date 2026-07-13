"use client";
import Link from "next/link";
import { useState } from "react";
import Navbar from "./components/Navbar";
export default function Home() {
  const temples = [
    {
      name: "Shree Siddhivinayak Temple",
      city: "Mumbai",
      image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800",
    },
    {
      name: "Kashi Vishwanath",
      city: "Varanasi",
      image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800",
    },
    {
      name: "Tirupati Balaji",
      city: "Andhra Pradesh",
      image: "https://images.unsplash.com/photo-1583391733956-6c77a2c4d61d?w=800",
    },
  ];
const [search, setSearch] = useState("");
  return (
    <main className="min-h-screen bg-orange-50">

      <Navbar />

      {/* Hero */}
      <section className="text-center py-24 px-6">
        <h2 className="text-6xl font-bold text-orange-700 mb-6">
          Welcome to DivyaArpan
        </h2>

        <p className="text-xl text-gray-700 mb-10">
          Book Temple Poojas • Donate • Offer Arpan • Receive Blessings
        </p>

        <input
  type="text"
  placeholder="Search Temple..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="border-2 border-orange-300 rounded-lg px-5 py-3 w-96 max-w-full"
/>
      </section>

      {/* Featured Temples */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">
          Featured Temples
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {temples
  .filter((temple) =>
    temple.name.toLowerCase().includes(search.toLowerCase())
  )
  .map((temple) => (

            <div
              key={temple.name}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:scale-105 transition"
            >

              <img
                src={temple.image}
                alt={temple.name}
                className="h-60 w-full object-cover"
              />

              <div className="p-6">

                <h3 className="text-2xl font-bold">
                  {temple.name}
                </h3>

                <p className="text-gray-500 mt-2">
                  📍 {temple.city}
                </p>

                <Link
  href={`/booking?temple=${encodeURIComponent(temple.name)}`}
  className="mt-5 inline-block bg-orange-600 text-white px-5 py-2 rounded-lg"
>
  Book Pooja
</Link>

              </div>

            </div>

          ))}

        </div>
      </section>
      {/* Pooja Services */}

<section className="max-w-7xl mx-auto px-6 py-16">

  <h2 className="text-4xl font-bold text-center mb-12 text-orange-700">
    Popular Pooja Services
  </h2>

  <div className="grid md:grid-cols-4 gap-8">

    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
      <div className="text-5xl mb-4">🙏</div>
      <h3 className="text-xl font-bold">
        Ganesh Pooja
      </h3>
      <p className="text-gray-600 mt-3">
        Seek blessings of Lord Ganesha for success and prosperity.
      </p>
      <Link
  href="/booking?pooja=Ganesh%20Pooja"
  className="mt-5 inline-block bg-orange-600 text-white px-5 py-2 rounded-lg"
>
  Book Now
</Link>
    </div>


    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
      <div className="text-5xl mb-4">🕉️</div>
      <h3 className="text-xl font-bold">
        Rudrabhishek
      </h3>
      <p className="text-gray-600 mt-3">
        Perform sacred rituals for peace and spiritual growth.
      </p>
      <Link
  href="/booking?pooja=Rudrabhishek"
  className="mt-5 inline-block bg-orange-600 text-white px-5 py-2 rounded-lg"
>
  Book Now
</Link>
    </div>


    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
      <div className="text-5xl mb-4">🌺</div>
      <h3 className="text-xl font-bold">
        Satyanarayan Pooja
      </h3>
      <p className="text-gray-600 mt-3">
        Complete traditional pooja with verified pandits.
      </p>
      <Link
  href="/booking?pooja=Satyanarayan%20Pooja"
  className="mt-5 inline-block bg-orange-600 text-white px-5 py-2 rounded-lg"
>
  Book Now
</Link>
    </div>


    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
      <div className="text-5xl mb-4">✨</div>
      <h3 className="text-xl font-bold">
        Navgrah Pooja
      </h3>
      <p className="text-gray-600 mt-3">
        Special rituals for harmony and positive energy.
      </p>
      <Link
  href="/booking?pooja=Navgrah%20Pooja"
  className="mt-5 inline-block bg-orange-600 text-white px-5 py-2 rounded-lg"
>
  Book Now
</Link>
    </div>

  </div>

</section>
{/* How DivyaArpan Works */}

<section className="bg-white py-16 px-6">

  <h2 className="text-4xl font-bold text-center mb-12 text-orange-700">
    How DivyaArpan Works
  </h2>

  <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 text-center">

    <div>
      <div className="text-5xl mb-4">🛕</div>
      <h3 className="text-xl font-bold">
        Select Temple
      </h3>
      <p className="text-gray-600 mt-2">
        Choose your preferred temple and devotional service.
      </p>
    </div>

    <div>
      <div className="text-5xl mb-4">🙏</div>
      <h3 className="text-xl font-bold">
        Choose Pooja
      </h3>
      <p className="text-gray-600 mt-2">
        Select from various traditional pooja services.
      </p>
    </div>

    <div>
      <div className="text-5xl mb-4">📝</div>
      <h3 className="text-xl font-bold">
        Make Sankalp
      </h3>
      <p className="text-gray-600 mt-2">
        Add devotee details and prayer intentions.
      </p>
    </div>

    <div>
      <div className="text-5xl mb-4">🔔</div>
      <h3 className="text-xl font-bold">
        Get Confirmation
      </h3>
      <p className="text-gray-600 mt-2">
        Receive booking confirmation and pooja updates.
      </p>
    </div>

  </div>

</section>
{/* Why Choose DivyaArpan */}

<section className="bg-orange-50 py-16 px-6">

  <h2 className="text-4xl font-bold text-center mb-12 text-orange-700">
    Why Choose DivyaArpan
  </h2>

  <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 text-center">

    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="text-5xl mb-4">🏛️</div>
      <h3 className="text-xl font-bold">
        Verified Temples
      </h3>
      <p className="text-gray-600 mt-3">
        Connect with trusted temples and authentic rituals.
      </p>
    </div>


    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="text-5xl mb-4">🙏</div>
      <h3 className="text-xl font-bold">
        Experienced Pandits
      </h3>
      <p className="text-gray-600 mt-3">
        Traditional poojas performed by knowledgeable priests.
      </p>
    </div>


    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="text-5xl mb-4">🔐</div>
      <h3 className="text-xl font-bold">
        Secure Payments
      </h3>
      <p className="text-gray-600 mt-3">
        Safe and reliable digital payment experience.
      </p>
    </div>


    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="text-5xl mb-4">📱</div>
      <h3 className="text-xl font-bold">
        Live Updates
      </h3>
      <p className="text-gray-600 mt-3">
        Receive booking and pooja completion updates.
      </p>
    </div>

  </div>

</section>

      {/* Footer */}

      <footer className="bg-orange-700 text-white text-center py-6">
        © 2026 DivyaArpan. All Rights Reserved.
      </footer>

    </main>
  );
}
