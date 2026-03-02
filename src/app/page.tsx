"use client";

import { useState, lazy, Suspense } from "react";
import dynamic from "next/dynamic";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import SafeComponent from "@/components/SafeComponent";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Navigation isMenuOpen={isMenuOpen} onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
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
  );
}
