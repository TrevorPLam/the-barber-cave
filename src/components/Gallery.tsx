import Image from 'next/image';

export default function Gallery() {
  // TODO: Replace SVG placeholders with actual barber work photos
  // Current assets are placeholder SVGs - should be replaced with:
  // - Real photos of haircuts, beard trims, and styling work
  // - High-quality images showing actual barber skills
  // - Optimized web formats (WebP/AVIF) for performance
  const galleryItems = [
    { id: 1, src: '/images/gallery/work-1.svg', title: 'Classic Fade', barber: 'Master Barber' },
    { id: 2, src: '/images/gallery/work-2.svg', title: 'Beard Trim', barber: 'Expert Barber' },
    { id: 3, src: '/images/gallery/work-3.svg', title: 'Modern Cut', barber: 'Senior Barber' },
    { id: 4, src: '/images/gallery/work-4.svg', title: 'Pompadour', barber: 'Master Barber' },
    { id: 5, src: '/images/gallery/work-5.svg', title: 'Crew Cut', barber: 'Expert Barber' },
    { id: 6, src: '/images/gallery/work-6.svg', title: 'Hot Towel Shave', barber: 'Senior Barber' },
  ];

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
            <div key={item.id} className="group relative overflow-hidden rounded-2xl bg-gray-200 aspect-square">
              <Image 
                src={item.src}
                alt={item.title}
                fill
                quality={75}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                  <p className="text-white font-semibold">{item.title}</p>
                  <p className="text-gray-300 text-sm">by {item.barber}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
