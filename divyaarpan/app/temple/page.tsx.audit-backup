"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import TempleGallery from "../components/TempleGallery";
import TempleMap from "../components/TempleMap";
import TemplePoojas from "../components/TemplePoojas";
import { temples } from "../data/temples";

export default function TempleDetails() {

  const searchParams = useSearchParams();

  const templeName =
    searchParams.get("name") || "Shree Siddhivinayak Temple";


  const temple =
    temples.find(
      (item) => item.name === templeName
    ) || temples[0];


  return (

    <main className="min-h-screen bg-orange-50">

      <section className="max-w-6xl mx-auto py-16 px-6">


        <img
          src={temple.image}
          alt={temple.name}
          className="w-full h-96 object-cover rounded-xl shadow-lg"
        />


        <h1 className="text-5xl font-bold text-orange-700 mt-8">
          {temple.name}
        </h1>


        <p className="text-gray-600 mt-3 text-lg">
          {temple.city}
        </p>


        <p className="mt-8 text-gray-700 leading-8">
          {temple.description}
        </p>



        <TempleGallery
          images={temple.images}
        />


        <TempleMap
          location={temple.map}
        />



        <div className="grid md:grid-cols-3 gap-6 mt-12">


          <div className="bg-white rounded-xl shadow-lg p-6">

            <h2 className="text-2xl font-bold mb-4">
              Temple Timings
            </h2>

            <p>
              🕔 Opening : {temple.opening}
            </p>

            <p>
              🌙 Closing : {temple.closing}
            </p>

          </div>




          <div className="bg-white rounded-xl shadow-lg p-6">

            <h2 className="text-2xl font-bold mb-4">
              Facilities
            </h2>


            <ul className="space-y-2">

              {temple.facilities.map(
                (facility) => (

                  <li key={facility}>
                    {facility}
                  </li>

                )
              )}

            </ul>

          </div>


        </div>




        <TemplePoojas
          poojas={temple.poojas}
          templeName={temple.name}
        />




        <div className="mt-12">

          <Link
            href={`/booking?temple=${encodeURIComponent(
              temple.name
            )}`}
            className="bg-orange-600 text-white px-8 py-4 rounded-lg text-xl hover:bg-orange-700"
          >

            Book Pooja

          </Link>

        </div>


      </section>


    </main>

  );
}