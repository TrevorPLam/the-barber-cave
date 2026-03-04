import Image from 'next/image';

/**
 * Gallery image component using Next.js Image with native lazy loading
 */
function GalleryImage({ src, alt, priority = false, ...props }: any) {
  return (
    <Image
      src={src}
      alt={alt}
      priority={priority}     // true only for above-fold images
      // loading="lazy" is implicit when priority={false}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      quality={85}
      {...props}
    />
  )
}

export default function Gallery() {
  // Gallery photos: replace SVG placeholders with real high-quality images
  // (WebP/AVIF) showing actual haircut and beard work. See T-F001 in TODO.md.
  const galleryItems = [
    { id: 1, src: '/images/gallery/work-1.svg', title: 'Classic Fade', barber: 'Master Barber', alt: 'Side profile view of a classic fade haircut with clean blended lines' },
    { id: 2, src: '/images/gallery/work-2.svg', title: 'Beard Trim', barber: 'Expert Barber', alt: 'Well-groomed beard with precise edge shaping and neckline definition' },
    { id: 3, src: '/images/gallery/work-3.svg', title: 'Modern Cut', barber: 'Senior Barber', alt: 'Contemporary textured haircut with volume on top and tapered sides' },
    { id: 4, src: '/images/gallery/work-4.svg', title: 'Pompadour', barber: 'Master Barber', alt: 'Classic pompadour style with high volume swept back and clean sides' },
    { id: 5, src: '/images/gallery/work-5.svg', title: 'Crew Cut', barber: 'Expert Barber', alt: 'Traditional crew cut with uniform length and neat military-style finish' },
    { id: 6, src: '/images/gallery/work-6.svg', title: 'Hot Towel Shave', barber: 'Senior Barber', alt: 'Traditional straight razor shave with hot towel treatment preparation' },
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
            <div 
              key={item.id} 
              className="group relative overflow-hidden rounded-2xl bg-gray-200 aspect-square cursor-pointer focus-within:ring-2 focus-within:ring-black focus-within:ring-offset-2"
              tabIndex={0}
              role="button"
              aria-label={`View ${item.title} by ${item.barber}`}
            >
              <GalleryImage 
                src={item.src}
                alt={item.alt}
                fill
                quality={75}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-all duration-500 ease-out motion-safe:group-hover:scale-110 motion-safe:group-focus:scale-110 group-hover:brightness-90 group-focus:brightness-90"
              />
              
              {/* Enhanced gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 motion-safe:group-hover:opacity-100 motion-safe:group-focus:opacity-100 transition-opacity duration-500 ease-out" />
              
              {/* Content overlay with slide-up animation */}
              <div className="absolute inset-0 flex items-end justify-center p-6">
                <div className="text-center transform motion-safe:translate-y-4 motion-safe:group-hover:translate-y-0 motion-safe:group-focus:translate-y-0 opacity-0 motion-safe:group-hover:opacity-100 motion-safe:group-focus:opacity-100 transition-all duration-500 ease-out delay-100">
                  <p className="text-white font-bold text-lg mb-1 drop-shadow-lg">{item.title}</p>
                  <p className="text-gray-200 text-sm drop-shadow-md">by {item.barber}</p>
                </div>
              </div>

              {/* Subtle border highlight on hover */}
              <div className="absolute inset-0 border-2 border-amber-500/0 motion-safe:group-hover:border-amber-500/60 motion-safe:group-focus:border-amber-500/60 rounded-2xl transition-all duration-300 ease-out pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
