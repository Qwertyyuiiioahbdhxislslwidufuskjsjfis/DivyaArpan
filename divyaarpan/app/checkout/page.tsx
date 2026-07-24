"use client";

import { useEffect, useState } from "react";
import Link from "next/link";


export default function Checkout() {


  const [booking, setBooking] = useState<any>(null);



  useEffect(() => {

  const fetchBooking = async () => {

    const bookingId =
      new URLSearchParams(window.location.search)
      .get("bookingId");


    if (!bookingId) return;


    const response = await fetch(
      `/api/bookings/${bookingId}`
    );


    const data = await response.json();


    if(data.success){

      setBooking(data.booking);

    }

  };


  fetchBooking();


}, []);





  if (!booking) {


    return (

      <main className="min-h-screen bg-orange-50 flex items-center justify-center">


        <h1 className="text-2xl font-bold text-orange-700">

          Loading Booking Details...

        </h1>


      </main>

    );


  }





  return (


    <main className="min-h-screen bg-orange-50 py-16 px-6">



      <section className="max-w-5xl mx-auto">



        <h1 className="text-4xl font-bold text-center text-orange-700 mb-10">

          Complete Your Booking

        </h1>





        <div className="grid md:grid-cols-2 gap-8">





          {/* Booking Summary */}



          <div className="bg-white rounded-xl shadow-lg p-8">



            <h2 className="text-2xl font-bold text-orange-700 mb-6">

              Booking Summary

            </h2>




            <p className="mb-4">

              🆔 Booking ID:

              <strong> {booking.bookingId}</strong>

            </p>




            <p className="mb-4">

              🛕 Temple:

              <strong> {booking.temple}</strong>

            </p>




            <p className="mb-4">

              🙏 Pooja:

              <strong> {booking.pooja}</strong>

            </p>




            <p className="mb-4">

              💰 Amount:

              <strong> {booking.price}</strong>

            </p>




            <p className="mb-4">

              ⏳ Duration:

              <strong> {booking.duration}</strong>

            </p>




            <p className="mb-4">

              👥 Devotees:

              <strong> {booking.devotees}</strong>

            </p>



          </div>








          {/* Devotee Details */}




          <div className="bg-white rounded-xl shadow-lg p-8">



            <h2 className="text-2xl font-bold text-orange-700 mb-6">

              Devotee Details

            </h2>




            <p className="mb-4">

              👤 Name:

              <strong> {booking.name}</strong>

            </p>




            <p className="mb-4">

              📱 Mobile:

              <strong> {booking.mobile}</strong>

            </p>




            <p className="mb-4">

              ✉️ Email:

              <strong> {booking.email}</strong>

            </p>




            <p className="mb-4">

              📅 Date:

              <strong> {booking.date}</strong>

            </p>




            <p className="mb-4">

              ⏰ Time:

              <strong> {booking.time}</strong>

            </p>






            <div className="mt-6">



              <h3 className="font-bold mb-2">

                🙏 Sankalp / Prayer

              </h3>




              <p className="bg-orange-50 p-4 rounded-lg">

                {booking.sankalp || "No Sankalp Added"}

              </p>



            </div>



          </div>




        </div>








        {/* Payment Section */}




        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">





          <h2 className="text-2xl font-bold text-orange-700 mb-6">

            Select Payment Method

          </h2>





          <div className="space-y-4">



            <label className="flex gap-3 items-center">

              <input

                type="radio"

                name="payment"

              />

              UPI

            </label>





            <label className="flex gap-3 items-center">

              <input

                type="radio"

                name="payment"

              />

              Credit / Debit Card

            </label>





            <label className="flex gap-3 items-center">

              <input

                type="radio"

                name="payment"

              />

              Net Banking

            </label>




          </div>








          <Link


            href={`/payment?bookingId=${booking.bookingId}`}


            className="block mt-8 text-center bg-orange-600 text-white py-4 rounded-lg text-lg hover:bg-orange-700"


          >

            Proceed To Payment


          </Link>





        </div>





      </section>




    </main>


  );


}