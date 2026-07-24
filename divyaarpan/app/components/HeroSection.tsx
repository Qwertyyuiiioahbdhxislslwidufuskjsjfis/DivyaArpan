export default function HeroSection() {
  return (
    <section
      className="relative h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://picsum.photos/1920/1080?religious')",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/55"></div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="text-center px-6 max-w-4xl">

          <h1 className="text-6xl font-extrabold text-white leading-tight">
            Experience Divine Blessings
          </h1>

          <p className="text-xl text-gray-200 mt-6">
            Book Poojas, Offer Arpan, Donate to Temples and
            receive blessings from India's most sacred temples.
          </p>

          <div className="mt-10 flex justify-center gap-4 flex-wrap">

            <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl text-lg font-semibold">
              Book Pooja
            </button>

            <button className="bg-white text-orange-700 px-8 py-4 rounded-xl text-lg font-semibold">
              Explore Temples
            </button>

          </div>

        </div>
      </div>
    </section>
  );
}