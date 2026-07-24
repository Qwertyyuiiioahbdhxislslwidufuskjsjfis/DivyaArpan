type TempleGalleryProps = {
  images?: string[];
};

export default function TempleGallery({ images = [] }: TempleGalleryProps) {
  return (
    <section className="mt-12">
      <h2 className="text-3xl font-bold text-orange-700 mb-6">
        Temple Gallery
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Temple ${index + 1}`}
            className="w-full h-60 object-cover rounded-xl shadow-lg hover:scale-105 transition duration-300"
          />
        ))}
      </div>
    </section>
  );
}