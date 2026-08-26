"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";


export default function Confirmation() {


  const searchParams = useSearchParams();


  const bookingId =
    searchParams.get("bookingId") || "DA000000";


  const temple =
    searchParams.get("temple") || "Not Selected";


  const pooja =
    searchParams.get("pooja") || "Not Selected";


  const price =
    searchParams.get("price") || "₹0";


  const duration =
    searchParams.get("duration") || "Not Available";


  const name =
    searchParams.get("name") || "Not Provided";


  const mobile =
    searchParams.get("mobile") || "Not Provided";


  const date =
    searchParams.get("date") || "Not Selected";


  const time =
    searchParams.get("time") || "Not Selected";


  const devotees =
    searchParams.get("devotees") || "1";


  const sankalp =
    searchParams.get("sankalp") || "No Sankalp";



  return (

    <main className="min-h-screen bg-orange-50 py-16 px-6">


      <section className="max-w-3xl mx-auto">


        <div className="bg-white rounded-xl shadow-lg p-8">


          <h1 className="text-4xl font-bold text-center text-orange-700 mb-8">
            🙏 Booking Confirmation
          </h1>



          <div className="bg-orange-100 rounded-lg p-6 mb-8">


            <h2 className="text-2xl font-bold mb-4">
              Booking Details
            </h2>



            <p className="mb-3">
              Booking ID:
              <strong> {bookingId}</strong>
            </p>


            <p className="mb-3">
              🛕 Temple:
              <strong> {temple}</strong>
            </p>


            <p className="mb-3">
              🙏 Pooja:
              <strong> {pooja}</strong>
            </p>


            <p className="mb-3">
              💰 Amount:
              <strong> {price}</strong>
            </p>


            <p className="mb-3">
              ⏳ Duration:
              <strong> {duration}</strong>
            </p>


          </div>





          <div className="border rounded-lg p-6 mb-8">


            <h2 className="text-2xl font-bold text-orange-700 mb-4">
              Devotee Details
            </h2>


            <p className="mb-3">
              👤 Name:
              <strong> {name}</strong>
            </p>


            <p className="mb-3">
              📱 Mobile:
              <strong> {mobile}</strong>
            </p>


            <p className="mb-3">
              📅 Date:
              <strong> {date}</strong>
            </p>


            <p className="mb-3">
              ⏰ Time:
              <strong> {time}</strong>
            </p>


            <p className="mb-3">
              👥 Devotees:
              <strong> {devotees}</strong>
            </p>


            <div className="mt-4">

              <h3 className="font-bold mb-2">
                🙏 Sankalp
              </h3>


              <p className="bg-orange-50 p-4 rounded-lg">
                {sankalp}
              </p>

            </div>


          </div>





          <Link

            href={`/payment?bookingId=${encodeURIComponent(bookingId)}&temple=${encodeURIComponent(temple)}&pooja=${encodeURIComponent(pooja)}&price=${encodeURIComponent(price)}`}

            className="block text-center bg-orange-600 text-white py-4 rounded-lg text-lg hover:bg-orange-700"

          >

            Proceed To Payment

          </Link>



        </div>


      </section>


    </main>

  );

}