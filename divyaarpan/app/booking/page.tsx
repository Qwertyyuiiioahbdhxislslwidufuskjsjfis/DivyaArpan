"use client";

import { useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { temples } from "../data/temples";

export default function Booking() {

  const searchParams = useSearchParams();

  const urlTemple = searchParams.get("temple");
  const urlPooja = searchParams.get("pooja");


  const initialTemple =
    temples.find((item) => item.name === urlTemple) || temples[0];


  const [selectedTemple, setSelectedTemple] =
    useState(initialTemple);


  const [selectedPooja, setSelectedPooja] =
    useState(
      initialTemple.poojas.find(
        (item) => item.name === urlPooja
      ) || initialTemple.poojas[0]
    );


  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [devotees, setDevotees] = useState("1");
  const [sankalp, setSankalp] = useState("");



  // Permanent booking ID during this booking session

  const bookingId = useRef(
    "DA" + Math.floor(100000 + Math.random() * 900000)
  ).current;




  const saveBooking = async () => {

  const bookingData = {

    bookingId,

    temple: selectedTemple.name,

    pooja: selectedPooja.name,

    price: selectedPooja.price,

    duration: selectedPooja.duration,

    name,

    mobile,

    email,

    date,

    time,

    devotees,

    sankalp,

  };


  try {

    const response = await fetch("/api/bookings", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(bookingData),

    });


    const result = await response.json();


    if (result.success) {

      window.location.href =
      `/checkout?bookingId=${bookingId}`;

    } else {

      alert("Booking failed. Please try again.");

    }


  } catch (error) {

    console.error(error);

    alert("Something went wrong.");

  }

};





  return (

    <main className="min-h-screen bg-orange-50">


      <section className="max-w-3xl mx-auto py-16 px-6">


        <h1 className="text-4xl font-bold text-center text-orange-700 mb-10">
          Book Your Pooja
        </h1>



        <div className="bg-white shadow-lg rounded-xl p-8 space-y-6">



          {/* Temple Selection */}


          <div>

            <label className="block font-semibold mb-2">
              Select Temple
            </label>


            <select

              value={selectedTemple.id}

              onChange={(e)=>{


                const temple =
                  temples.find(
                    (item)=>item.id === e.target.value
                  ) || temples[0];


                setSelectedTemple(temple);

                setSelectedPooja(
                  temple.poojas[0]
                );


              }}

              className="w-full border rounded-lg p-3"

            >


              {temples.map((temple)=>(

                <option

                  key={temple.id}

                  value={temple.id}

                >

                  {temple.name}

                </option>

              ))}


            </select>


          </div>






          {/* Pooja Selection */}


          <div>


            <label className="block font-semibold mb-2">
              Select Pooja
            </label>


            <select

              value={selectedPooja.name}

              onChange={(e)=>{


                const pooja =
                  selectedTemple.poojas.find(
                    (item)=>
                    item.name === e.target.value
                  );


                if(pooja){

                  setSelectedPooja(pooja);

                }


              }}

              className="w-full border rounded-lg p-3"


            >


              {selectedTemple.poojas.map((pooja)=>(

                <option

                  key={pooja.name}

                >

                  {pooja.name}

                </option>

              ))}


            </select>


          </div>






          {/* Devotee Details */}


          <input

            type="text"

            value={name}

            onChange={(e)=>setName(e.target.value)}

            placeholder="Devotee Name"

            className="w-full border rounded-lg p-3"

          />



          <input

            type="tel"

            value={mobile}

            onChange={(e)=>setMobile(e.target.value)}

            placeholder="Mobile Number"

            className="w-full border rounded-lg p-3"

          />



          <input

            type="email"

            value={email}

            onChange={(e)=>setEmail(e.target.value)}

            placeholder="Email Address"

            className="w-full border rounded-lg p-3"

          />



          <input

            type="date"

            value={date}

            onChange={(e)=>setDate(e.target.value)}

            className="w-full border rounded-lg p-3"

          />



          <input

            type="time"

            value={time}

            onChange={(e)=>setTime(e.target.value)}

            className="w-full border rounded-lg p-3"

          />



          <input

            type="number"

            min="1"

            value={devotees}

            onChange={(e)=>setDevotees(e.target.value)}

            className="w-full border rounded-lg p-3"

          />




          <textarea

            value={sankalp}

            onChange={(e)=>setSankalp(e.target.value)}

            placeholder="Write your prayer or sankalp..."

            rows={5}

            className="w-full border rounded-lg p-3"

          />







          {/* Summary */}


          <div className="bg-orange-100 rounded-lg p-5">


            <h2 className="text-2xl font-bold text-orange-700 mb-4">

              Booking Summary

            </h2>



            <p>
              Booking ID:
              <strong> {bookingId}</strong>
            </p>


            <p>
              Temple:
              <strong> {selectedTemple.name}</strong>
            </p>


            <p>
              Pooja:
              <strong> {selectedPooja.name}</strong>
            </p>


            <p>
              Price:
              <strong> {selectedPooja.price}</strong>
            </p>


            <p>
              Duration:
              <strong> {selectedPooja.duration}</strong>
            </p>


          </div>







          <button


            onClick={saveBooking}


            className="block w-full text-center bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700"


          >

            Continue to Checkout


          </button>





        </div>


      </section>


    </main>

  );


}