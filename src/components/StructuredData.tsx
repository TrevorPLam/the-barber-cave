import { BUSINESS_INFO, EXTERNAL_LINKS } from '@/data/constants';

interface StructuredDataProps {
  type: 'Organization' | 'LocalBusiness' | 'BreadcrumbList' | 'Service';
  data?: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    switch (type) {
      case 'Organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": BUSINESS_INFO.name,
          "description": BUSINESS_INFO.description,
          "url": "https://trills-barber-cave.vercel.app",
          "logo": "https://trills-barber-cave.vercel.app/logo.png",
          "image": "https://trills-barber-cave.vercel.app/hero-image.jpg",
          "telephone": BUSINESS_INFO.phone,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": BUSINESS_INFO.address.split(',')[0],
            "addressLocality": "Dallas",
            "addressRegion": "TX",
            "postalCode": BUSINESS_INFO.address.split(', ')[2],
            "addressCountry": "US"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": BUSINESS_INFO.coordinates.latitude,
            "longitude": BUSINESS_INFO.coordinates.longitude
          },
          "openingHours": [
            "Mo-Fr 09:00-19:00",
            "Sa 08:00-20:00",
            "Su 10:00-18:00"
          ],
          "priceRange": "$$",
          "sameAs": [
            EXTERNAL_LINKS.instagram,
            EXTERNAL_LINKS.facebook,
            EXTERNAL_LINKS.youtube
          ],
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": BUSINESS_INFO.rating,
            "reviewCount": BUSINESS_INFO.totalReviews,
            "bestRating": "5",
            "worstRating": "1"
          }
        };

      case 'LocalBusiness':
        return {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": BUSINESS_INFO.name,
          "description": BUSINESS_INFO.description,
          "url": "https://trills-barber-cave.vercel.app",
          "telephone": BUSINESS_INFO.phone,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": BUSINESS_INFO.address.split(',')[0],
            "addressLocality": "Dallas",
            "addressRegion": "TX",
            "postalCode": BUSINESS_INFO.address.split(', ')[2],
            "addressCountry": "US"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": BUSINESS_INFO.coordinates.latitude,
            "longitude": BUSINESS_INFO.coordinates.longitude
          },
          "openingHours": [
            "Mo-Fr 09:00-19:00",
            "Sa 08:00-20:00",
            "Su 10:00-18:00"
          ],
          "priceRange": "$$",
          "servesCuisine": "Barber Services",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": BUSINESS_INFO.rating,
            "reviewCount": BUSINESS_INFO.totalReviews,
            "bestRating": "5",
            "worstRating": "1"
          }
        };

      case 'BreadcrumbList':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": data?.breadcrumbs || [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://trills-barber-cave.vercel.app"
            }
          ]
        };

      case 'Service':
        return {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": data?.name || "Professional Barber Services",
          "description": data?.description || "Premium grooming and barber services in Dallas",
          "provider": {
            "@type": "Organization",
            "name": BUSINESS_INFO.name,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Dallas",
              "addressRegion": "TX",
              "addressCountry": "US"
            }
          },
          "serviceType": "Barber Services",
          "areaServed": {
            "@type": "City",
            "name": "Dallas",
            "addressCountry": "US"
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Barber Services Menu",
            "itemListElement": data?.services?.map((service: any) => ({
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": service.title,
                "description": service.description,
                "serviceType": "Barber Service"
              },
              "price": service.price,
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            })) || []
          }
        };

      default:
        return {};
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData || Object.keys(structuredData).length === 0) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData).replace(/</g, '\\u003c')
      }}
    />
  );
}
