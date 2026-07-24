type TempleMapProps = {
  location: string;
};

export default function TempleMap({ location }: TempleMapProps) {
  return (
    <section className="mt-12">
      <h2 className="text-3xl font-bold text-orange-700 mb-6">
        Temple Location
      </h2>

      <div className="bg-white rounded-xl shadow-lg p-6">

        <iframe
          src={location}
          width="100%"
          height="450"
          loading="lazy"
          style={{ border: 0 }}
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>

      </div>
    </section>
  );
}
