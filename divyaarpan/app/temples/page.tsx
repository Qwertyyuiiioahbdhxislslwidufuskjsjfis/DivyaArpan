export default function Temples() {

  const temples = [
    {
      name: "Shree Siddhivinayak Temple",
      location: "Mumbai, Maharashtra",
      deity: "Lord Ganesha",
    },
    {
      name: "Kashi Vishwanath Temple",
      location: "Varanasi, Uttar Pradesh",
      deity: "Lord Shiva",
    },
    {
      name: "Tirupati Balaji Temple",
      location: "Tirupati, Andhra Pradesh",
      deity: "Lord Venkateswara",
    },
    {
      name: "Somnath Temple",
      location: "Gujarat",
      deity: "Lord Shiva",
    },
  ];


  return (

    <main className="min-h-screen bg-orange-50">

      <section className="text-center py-16">

        <h1 className="text-5xl font-bold text-orange-700">
          Explore Temples
        </h1>

        <p className="mt-4 text-gray-700 text-xl">
          Discover sacred temples and book devotional services
        </p>

      </section>


      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8">


        {temples.map((temple)=>(
          
          <div
            key={temple.name}
            className="bg-white p-8 rounded-xl shadow-lg"
          >

            <h2 className="text-2xl font-bold text-orange-700">
              {temple.name}
            </h2>

            <p className="mt-3">
              📍 {temple.location}
            </p>

            <p className="mt-2">
              🙏 Deity: {temple.deity}
            </p>


            <button className="mt-6 bg-orange-600 text-white px-6 py-3 rounded-lg">
              View Temple
            </button>


          </div>

        ))}


      </section>

    </main>

  );
}