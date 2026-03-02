export default function Gallery() {
  const galleryItems = Array.from({ length: 6 }, (_, i) => i + 1);

  return (
    <section id="work" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Our Work</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See the transformations and styles that define The Barber Cave experience
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <div key={item} className="group relative overflow-hidden rounded-2xl bg-gray-200 aspect-square">
              <img 
                src={`https://images.unsplash.com/photo-1501924267684-cd9a8f9f8b${item}?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`}
                alt={`Barber work ${item}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                  <p className="text-white font-semibold">Classic Fade</p>
                  <p className="text-gray-300 text-sm">by Master Barber</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
