import { Suspense } from "react";
import dynamic from "next/dynamic";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import SafeComponent from "@/components/SafeComponent";
import { services } from '@/data/services';

// Lazy load components that are not immediately visible with Suspense boundaries
const EventCountdown = dynamic(() => import("@/components/EventCountdown"), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
});

const Gallery = dynamic(() => import("@/components/Gallery"), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
});

const Services = dynamic(() => import("@/components/Services"), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
});

const Barbers = dynamic(() => import("@/components/Barbers"), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
});

const Community = dynamic(() => import("@/components/Community"), {
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
    <>
      <Navigation />
      <div className="min-h-screen bg-white">
        <StructuredData type="Service" data={serviceStructuredData} />
        {/* Only render breadcrumbs if there's actual navigation value (more than 1 item) */}
        {breadcrumbItems.length >= 2 && (
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        )}
        <Hero />
        <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
          <SafeComponent componentName="EventCountdown">
            <EventCountdown />
          </SafeComponent>
        </Suspense>
        <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
          <SafeComponent componentName="Gallery">
            <Gallery />
          </SafeComponent>
        </Suspense>
        <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
          <SafeComponent componentName="Services">
            <Services />
          </SafeComponent>
        </Suspense>
        <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
          <SafeComponent componentName="Barbers">
            <Barbers />
          </SafeComponent>
        </Suspense>
        <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
          <SafeComponent componentName="Community">
            <Community />
          </SafeComponent>
        </Suspense>
        <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
          <SafeComponent componentName="About">
            <About />
          </SafeComponent>
        </Suspense>
        <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse" />}>
          <SafeComponent componentName="Contact">
            <Contact />
          </SafeComponent>
        </Suspense>
        <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse" />}>
          <SafeComponent componentName="Social">
            <Social />
          </SafeComponent>
        </Suspense>
        <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse" />}>
          <SafeComponent componentName="Footer">
            <Footer />
          </SafeComponent>
        </Suspense>
      </div>
    </>
  );
}
