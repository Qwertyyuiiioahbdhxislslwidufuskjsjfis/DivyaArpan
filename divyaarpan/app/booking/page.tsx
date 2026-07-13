"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
export default function Booking() {
  const searchParams = useSearchParams();

const selectedPooja = searchParams.get("pooja");
const selectedTemple = searchParams.get("temple");
  return (
    <main className="min-h-screen bg-orange-50">

      <section className="max-w-3xl mx-auto py-16 px-6">

        <h1 className="text-4xl font-bold text-center text-orange-700 mb-10">
          Book Your Pooja
        </h1>

        <form className="bg-white shadow-lg rounded-xl p-8 space-y-6">

          {/* Temple */}

          <div>
            <label className="block font-semibold mb-2">
              Select Temple
            </label>

            <select
  defaultValue={selectedTemple || "Shree Siddhivinayak Temple"}
  className="w-full border rounded-lg p-3"
>
              <option>Siddhivinayak Temple</option>
              <option>Kashi Vishwanath</option>
              <option>Tirupati Balaji</option>
              <option>Somnath Temple</option>
            </select>
          </div>

          {/* Pooja */}

          <div>
            <label className="block font-semibold mb-2">
              Select Pooja
            </label>

            <select
  defaultValue={selectedPooja || "Ganesh Pooja"}
  className="w-full border rounded-lg p-3"
>
  <option>Ganesh Pooja</option>
  <option>Rudrabhishek</option>
  <option>Satyanarayan Pooja</option>
  <option>Navgrah Pooja</option>
</select>
          </div>

          {/* Name */}

          <div>
            <label className="block font-semibold mb-2">
              Devotee Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Mobile */}

          <div>
            <label className="block font-semibold mb-2">
              Mobile Number
            </label>

            <input
              type="tel"
              placeholder="Enter your mobile number"
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Email */}

          <div>
            <label className="block font-semibold mb-2">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Date */}

          <div>
            <label className="block font-semibold mb-2">
              Preferred Date
            </label>

            <input
              type="date"
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Time */}

          <div>
            <label className="block font-semibold mb-2">
              Preferred Time
            </label>

            <input
              type="time"
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Devotees */}

          <div>
            <label className="block font-semibold mb-2">
              Number of Devotees
            </label>

            <input
              type="number"
              min="1"
              placeholder="1"
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Sankalp */}

          <div>
            <label className="block font-semibold mb-2">
              Sankalp / Prayer
            </label>

            <textarea
              placeholder="Write your prayer or sankalp..."
              rows={5}
              className="w-full border rounded-lg p-3"
            ></textarea>
          </div>

          {/* Booking Summary */}

          <div className="bg-orange-100 rounded-lg p-5">
            <h2 className="text-2xl font-bold text-orange-700 mb-4">
              Booking Summary
            </h2>

            <p className="mb-2">
  Temple: <strong>{selectedTemple || "Not Selected"}</strong>
</p>

<p className="mb-2">
  Pooja: <strong>{selectedPooja || "Not Selected"}</strong>
</p>

            <p className="mb-2">
              Booking Fee: <strong>₹501</strong>
            </p>
          </div>

          {/* Button */}

          <Link
  href="/payment"
  className="block w-full text-center bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700"
>
  Continue to Payment
</Link>

        </form>

      </section>

    </main>
  );
}