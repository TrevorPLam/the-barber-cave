import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import AccessibilityProvider from "@/components/AccessibilityProvider";
import StructuredData from "@/components/StructuredData";
import { SITE_URL, BUSINESS_INFO } from "@/data/constants";
import { SessionWrapper } from "@/components/providers/SessionWrapper";
import AxeLoader from "@/components/AxeLoader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: '%s | The Barber Cave - Luxury Barber Shop & SMP Services Dallas',
    default: 'The Barber Cave - Luxury Barber Shop & SMP Services Dallas'
  },
  description: `Experience luxury grooming at The Barber Cave, Dallas' premier barbershop. Owned by Trill LadiBarber, offering premium cuts, scalp micropigmentation (SMP), and master barber services. 4.9 stars (194+ reviews). International locations in Dallas & London.`,
  keywords: "barber shop Dallas, The Barber Cave, luxury grooming, Trill LadiBarber, scalp micropigmentation Dallas, SMP services, expert barber, fade specialist, loc services, beard grooming, hot towel shave, Dallas haircut, men's grooming Texas, Magic Drip products, international barber shop, female barber Dallas, premium grooming services",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'The Barber Cave',
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    title: "The Barber Cave - Luxury Barber Shop & SMP Services Dallas",
    description: `Experience luxury grooming at The Barber Cave, Dallas' premier barbershop. Owned by Trill LadiBarber, offering premium cuts, scalp micropigmentation (SMP), and master barber services. 4.9 stars (194+ reviews). International locations in Dallas & London.`,
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "The Barber Cave",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Barber Cave - Dallas' Luxury Barber Shop & SMP Services",
    description: `Luxury grooming at The Barber Cave. Owned by Trill LadiBarber, offering premium cuts, scalp micropigmentation (SMP), and master barber services. 4.9 stars (194+ reviews). International locations in Dallas & London.`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* PWA theme color */}
        <meta name="theme-color" content="#d4af37" />
        {/* Resource hints for performance optimization */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preload" href="/globals.css" as="style" />
        <link rel="stylesheet" href="/globals.css" />
        
        <StructuredData type="LocalBusiness" />
      </head>
      <body
        className={`${inter.variable} antialiased`}
      >
        <ErrorBoundary>
          <AccessibilityProvider />
          <AxeLoader />
          <SessionWrapper>
            {children}
          </SessionWrapper>
        </ErrorBoundary>
      </body>
    </html>
  );
}
