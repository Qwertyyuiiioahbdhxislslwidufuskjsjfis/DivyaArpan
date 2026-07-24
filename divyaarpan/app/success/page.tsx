"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";


export default function Success() {
  const searchParams = useSearchParams();
const bookingId = searchParams.get("bookingId");


  const [booking, setBooking] = useState<any>(null);


  const bookingDate =
    new Date().toLocaleDateString("en-IN");



  useEffect(() => {

  if (!bookingId) return;

  fetch(`/api/bookings/${bookingId}`)
    .then((res) => res.json())
    .then((data) => {

      if (data.success) {
        setBooking(data.booking);
      }

    });

}, [bookingId]);






  if (!booking) {


    return (

      <main className="min-h-screen bg-orange-50 flex items-center justify-center">


        <h1 className="text-2xl font-bold text-orange-700">

          Loading Receipt...

        </h1>


      </main>

    );


  }







  return (


    <main className="min-h-screen bg-orange-50 py-16 px-6 print:bg-white">



      <section className="max-w-3xl mx-auto print:max-w-full">



        <div className="bg-white rounded-2xl shadow-xl overflow-hidden print:shadow-none print:border">





          {/* Header */}



          <div className="bg-orange-600 text-white p-8 text-center print:bg-white print:text-black print:border-b">


            <div className="text-5xl mb-3">
              🙏
            </div>



            <h1 className="text-4xl font-bold">
              DivyaArpan
            </h1>



            <p className="mt-2 text-xl font-semibold">
              Booking Successful
            </p>



            <p>
              Official Pooja Booking Receipt
            </p>


          </div>








          <div className="p-8">





            {/* Receipt Header */}



            <div className="flex justify-between mb-8">


              <div>


                <h2 className="text-2xl font-bold text-orange-700 print:text-black">

                  Booking Receipt

                </h2>



                <p className="text-gray-600">

                  Thank you for choosing DivyaArpan

                </p>


              </div>






              <div className="text-right">


                <p className="font-semibold">

                  Booking ID

                </p>



                <p className="font-bold text-orange-700 print:text-black">

                  {booking.bookingId}

                </p>



                <p className="text-sm text-gray-500 mt-2">

                  Date: {bookingDate}

                </p>


              </div>



            </div>









            {/* Pooja Details */}



            <div className="bg-orange-50 rounded-xl p-6 print:bg-white print:border">


              <h3 className="text-xl font-bold text-orange-700 mb-5 print:text-black">

                🙏 Pooja Details

              </h3>





              <p className="mb-3">

                🛕 Temple:

                <strong> {booking.temple}</strong>

              </p>





              <p className="mb-3">

                🌺 Pooja:

                <strong> {booking.pooja}</strong>

              </p>





              <p className="mb-3">

                💰 Amount Paid:

                <strong> {booking.price}</strong>

              </p>





              <p>

                ⏳ Duration:

                <strong> {booking.duration}</strong>

              </p>



            </div>









            {/* Devotee Details */}



            <div className="mt-6 border rounded-xl p-6">


              <h3 className="text-xl font-bold text-orange-700 mb-4 print:text-black">

                👤 Devotee Details

              </h3>





              <p className="mb-3">

                Name:

                <strong> {booking.name}</strong>

              </p>





              <p className="mb-3">

                Mobile:

                <strong> {booking.mobile}</strong>

              </p>





              <p className="mb-3">

                Email:

                <strong> {booking.email}</strong>

              </p>





              <p className="mb-3">

                Date:

                <strong> {booking.date}</strong>

              </p>





              <p className="mb-3">

                Time:

                <strong> {booking.time}</strong>

              </p>





              <p>

                Devotees:

                <strong> {booking.devotees}</strong>

              </p>



            </div>









            {/* Payment Status */}



            <div className="mt-6 border rounded-xl p-6">


              <h3 className="text-xl font-bold text-orange-700 mb-4 print:text-black">

                Payment Status

              </h3>





              <p>

                Status:


                <span className="ml-2 bg-green-100 text-green-700 px-4 py-1 rounded-full font-semibold print:bg-white print:text-black print:border">

                  Confirmed

                </span>


              </p>





              <p className="mt-4">

                Payment:

                <strong> Successful</strong>

              </p>



            </div>









            {/* Sankalp */}



            <div className="mt-6 bg-yellow-50 border rounded-xl p-5 print:bg-white">


              <h3 className="font-bold mb-2">

                🙏 Sankalp / Prayer

              </h3>




              <p>

                {booking.sankalp || "No Sankalp Added"}

              </p>



            </div>









            {/* Buttons */}



            <div className="flex gap-4 mt-8 print:hidden">



              <button

                onClick={() => window.print()}

                className="flex-1 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700"

              >

                🖨 Print Receipt

              </button>







              <Link

                href="/"

                className="flex-1 text-center bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900"

              >

                Back Home

              </Link>



            </div>





          </div>



        </div>



      </section>



    </main>


  );


}