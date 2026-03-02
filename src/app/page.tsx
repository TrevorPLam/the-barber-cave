import { lazy, Suspense } from "react";
import dynamic from "next/dynamic";
import MobileMenuWrapper from "@/components/MobileMenuWrapper";
import Hero from "@/components/Hero";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import SafeComponent from "@/components/SafeComponent";
import { services } from '@/data/services';

// Lazy load components that are not immediately visible
const Gallery = dynamic(() => import("@/components/Gallery"), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
});

const Services = dynamic(() => import("@/components/Services"), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
});

const Barbers = dynamic(() => import("@/components/Barbers"), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
});

const About = dynamic(() => import("@/components/About"), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
});

const Contact = dynamic(() => import("@/components/Contact"), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse" />,
});

const Social = dynamic(() => import("@/components/Social"), {
  loading: () => <div className="h-32 bg-gray-100 animate-pulse" />,
});

const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => <div className="h-32 bg-gray-100 animate-pulse" />,
});

export default function Home() {
  const breadcrumbItems = [
    { name: 'Home', href: '/' }
  ];

  const serviceStructuredData = {
    name: "Professional Barber Services",
    description: "Complete range of premium barber services including cuts, shaves, grooming, and loc services",
    services: services.slice(0, 6) // Include first 6 services for structured data
  };

  return (
    <MobileMenuWrapper>
      <div className="min-h-screen bg-white">
        <StructuredData type="Service" data={serviceStructuredData} />
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        <Hero />
        <SafeComponent componentName="Gallery">
          <Gallery />
        </SafeComponent>
        <SafeComponent componentName="Services">
          <Services />
        </SafeComponent>
        <SafeComponent componentName="Barbers">
          <Barbers />
        </SafeComponent>
        <SafeComponent componentName="About">
          <About />
        </SafeComponent>
        <SafeComponent componentName="Contact">
          <Contact />
        </SafeComponent>
        <SafeComponent componentName="Social">
          <Social />
        </SafeComponent>
        <SafeComponent componentName="Footer">
          <Footer />
        </SafeComponent>
      </div>
    </MobileMenuWrapper>
  );
}
