"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "./components/Navbar";
import { temples } from "./data/temples";

export default function Home() {

  


  const [search, setSearch] = useState("");


  const filteredTemples = temples.filter((temple) =>
    temple.name.toLowerCase().includes(search.toLowerCase())
  );


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


        <div className="flex justify-center">

          <input
            type="text"
            placeholder="Search Temple..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-2 border-orange-300 rounded-lg px-5 py-3 w-96 max-w-full focus:outline-none focus:border-orange-600"
          />

        </div>


        {search && (

          <div className="mt-5 mx-auto w-96 max-w-full bg-white shadow-lg rounded-lg text-left">

            {filteredTemples.length > 0 ? (

              filteredTemples.map((temple) => (

                <Link
                  key={temple.name}
                  href={`/temples/${temple.id}`}
                  className="block p-4 border-b hover:bg-orange-50"
                >
                  {temple.name}
                </Link>

              ))

            ) : (

              <p className="p-4 text-gray-500">
                No temple found
              </p>

            )}

          </div>

        )}

      </section>




      {/* Featured Temples */}

      <section className="max-w-7xl mx-auto px-6 py-16">

        <h2 className="text-4xl font-bold text-center mb-12">
          Featured Temples
        </h2>


        <div className="grid md:grid-cols-3 gap-8">


          {filteredTemples.map((temple) => (

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
                  href={`/temples/${temple.id}`}
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


          {[
            {
              name:"Ganesh Pooja",
              icon:"🙏",
              text:"Seek blessings of Lord Ganesha for success and prosperity."
            },
            {
              name:"Rudrabhishek",
              icon:"🕉️",
              text:"Perform sacred rituals for peace and spiritual growth."
            },
            {
              name:"Satyanarayan Pooja",
              icon:"🌺",
              text:"Complete traditional pooja with verified pandits."
            },
            {
              name:"Navgrah Pooja",
              icon:"✨",
              text:"Special rituals for harmony and positive energy."
            }
          ].map((pooja)=> (

            <div
              key={pooja.name}
              className="bg-white p-6 rounded-xl shadow-lg text-center"
            >

              <div className="text-5xl mb-4">
                {pooja.icon}
              </div>


              <h3 className="text-xl font-bold">
                {pooja.name}
              </h3>


              <p className="text-gray-600 mt-3">
                {pooja.text}
              </p>


              <Link
                href={`/booking?pooja=${encodeURIComponent(pooja.name)}`}
                className="mt-5 inline-block bg-orange-600 text-white px-5 py-2 rounded-lg"
              >
                Book Now
              </Link>


            </div>

          ))}


        </div>

      </section>





      {/* How DivyaArpan Works */}

      <section className="bg-white py-16 px-6">

        <h2 className="text-4xl font-bold text-center mb-12 text-orange-700">
          How DivyaArpan Works
        </h2>


        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 text-center">

          {[
            ["🛕","Select Temple","Choose your preferred temple and devotional service."],
            ["🙏","Choose Pooja","Select from various traditional pooja services."],
            ["📝","Make Sankalp","Add devotee details and prayer intentions."],
            ["🔔","Get Confirmation","Receive booking confirmation and pooja updates."]
          ].map((item)=>(
            <div key={item[1]}>
              <div className="text-5xl mb-4">{item[0]}</div>
              <h3 className="text-xl font-bold">{item[1]}</h3>
              <p className="text-gray-600 mt-2">{item[2]}</p>
            </div>
          ))}


        </div>

      </section>





      {/* Why Choose DivyaArpan */}

      <section className="bg-orange-50 py-16 px-6">

        <h2 className="text-4xl font-bold text-center mb-12 text-orange-700">
          Why Choose DivyaArpan
        </h2>


        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 text-center">

          {[
            ["🏛️","Verified Temples","Connect with trusted temples and authentic rituals."],
            ["🙏","Experienced Pandits","Traditional poojas performed by knowledgeable priests."],
            ["🔐","Secure Payments","Safe and reliable digital payment experience."],
            ["📱","Live Updates","Receive booking and pooja completion updates."]
          ].map((item)=>(
            <div
              key={item[1]}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="text-5xl mb-4">{item[0]}</div>
              <h3 className="text-xl font-bold">{item[1]}</h3>
              <p className="text-gray-600 mt-3">{item[2]}</p>
            </div>
          ))}


        </div>

      </section>




      {/* Footer */}

      <footer className="bg-orange-700 text-white text-center py-6">

        © 2026 DivyaArpan. All Rights Reserved.

      </footer>


    </main>
  );
}