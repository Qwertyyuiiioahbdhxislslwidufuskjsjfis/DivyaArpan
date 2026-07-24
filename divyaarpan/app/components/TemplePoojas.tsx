import Link from "next/link";

type Pooja = {
  name: string;
  price: string;
  duration: string;
};

type TemplePoojasProps = {
  poojas: Pooja[];
  templeName: string;
};

export default function TemplePoojas({
  poojas,
  templeName,
}: TemplePoojasProps) {
  return (
    <section className="mt-16">

      <div className="text-center mb-10">

        <h2 className="text-4xl font-bold text-orange-700">
          🙏 Available Poojas
        </h2>

        <p className="text-gray-600 mt-3">
          Choose your preferred pooja and book instantly.
        </p>

      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

        {poojas.map((pooja, index) => (

          <div
            key={pooja.name}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border hover:-translate-y-2"
          >

            {/* Card Header */}

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">

              <div className="flex justify-between items-start">

                <h3 className="text-2xl font-bold">
                  {pooja.name}
                </h3>

                {index === 0 && (
                  <span className="bg-white text-orange-600 text-xs font-bold px-3 py-1 rounded-full">
                    Popular
                  </span>
                )}

              </div>

            </div>

            {/* Card Body */}

            <div className="p-6">

              <div className="space-y-4">

                <div className="flex justify-between items-center">

                  <span className="text-gray-600">
                    💰 Price
                  </span>

                  <span className="text-xl font-bold text-green-600">
                    {pooja.price}
                  </span>

                </div>

                <div className="flex justify-between items-center">

                  <span className="text-gray-600">
                    ⏳ Duration
                  </span>

                  <span className="font-semibold">
                    {pooja.duration}
                  </span>

                </div>

              </div>

              <hr className="my-6" />

              <Link
                href={`/booking?temple=${encodeURIComponent(
                  templeName
                )}&pooja=${encodeURIComponent(
                  pooja.name
                )}`}
                className="block w-full text-center bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-xl transition"
              >
                Book Now
              </Link>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}