import { BUSINESS_INFO, EXTERNAL_LINKS, SITE_URL, BUSINESS_METRICS } from '@/data/constants';
import { Service } from '@/data/services';

export interface BreadcrumbData {
  breadcrumbs: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
}

interface ServiceData {
  name?: string;
  description?: string;
  services?: Service[];
}

type StructuredDataProps =
  | { type: 'Organization' | 'LocalBusiness' | 'HairSalon'; data?: never }
  | { type: 'BreadcrumbList'; data: BreadcrumbData }
  | { type: 'Service'; data: ServiceData };

export default function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    switch (type) {
      case 'Organization':
      case 'LocalBusiness':
        return {
          "@context": "https://schema.org",
          "@type": type,
          "name": BUSINESS_INFO.name,
          "description": BUSINESS_INFO.description,
          "url": SITE_URL,
          "logo": `${SITE_URL}/logo.png`,
          "image": `${SITE_URL}/hero-image.jpg`,
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
          "openingHours": BUSINESS_METRICS.structuredDataHours.map(hours => `${hours.days} ${hours.open}-${hours.close}`),
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

      case 'HairSalon':
        return {
          "@context": "https://schema.org",
          "@type": "HairSalon",
          "name": BUSINESS_INFO.name,
          "description": BUSINESS_INFO.description,
          "url": SITE_URL,
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
          "openingHours": BUSINESS_METRICS.structuredDataHours.map(hours => `${hours.days} ${hours.open}-${hours.close}`),
          "priceRange": "$$",
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
              "item": SITE_URL
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
            "itemListElement": data?.services?.map((service: Service) => {
              const offer: any = {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": service.title,
                  "description": service.description,
                  "serviceType": "Barber Service"
                },
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              };

              // Use PriceSpecification for ranges, simple price for fixed amounts
              if (service.priceMin !== undefined && service.priceMax !== undefined) {
                if (service.priceMin === service.priceMax) {
                  // Fixed price
                  offer.price = service.priceMin;
                } else {
                  // Price range
                  offer.priceSpecification = {
                    "@type": "PriceSpecification",
                    "minPrice": service.priceMin,
                    "maxPrice": service.priceMax,
                    "priceCurrency": "USD"
                  };
                }
              }

              return offer;
            }) || []
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
