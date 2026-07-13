export default function Pooja() {

  const poojas = [
    {
      name: "Ganesh Pooja",
      description: "Seek blessings of Lord Ganesha for success and prosperity.",
      price: "₹1100"
    },
    {
      name: "Rudrabhishek",
      description: "A sacred Shiva ritual for peace and spiritual growth.",
      price: "₹2100"
    },
    {
      name: "Satyanarayan Pooja",
      description: "Traditional pooja performed for happiness and prosperity.",
      price: "₹2500"
    },
    {
      name: "Navgrah Pooja",
      description: "Special rituals for harmony and positive energy.",
      price: "₹3100"
    }
  ];


  return (

    <main className="min-h-screen bg-orange-50">

      <section className="text-center py-16">

        <h1 className="text-5xl font-bold text-orange-700">
          Pooja Services
        </h1>

        <p className="mt-4 text-xl text-gray-700">
          Book authentic devotional services from trusted temples
        </p>

      </section>


      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8">


        {poojas.map((pooja)=>(

          <div
            key={pooja.name}
            className="bg-white p-8 rounded-xl shadow-lg"
          >

            <h2 className="text-2xl font-bold text-orange-700">
              {pooja.name}
            </h2>


            <p className="mt-3 text-gray-600">
              {pooja.description}
            </p>


            <p className="mt-4 text-xl font-bold">
              Starting from {pooja.price}
            </p>


            <button className="mt-6 bg-orange-600 text-white px-6 py-3 rounded-lg">
              Book Now
            </button>


          </div>

        ))}


      </section>


    </main>

  );
}