import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import reportAccessibility from "@/utils/accessibility";
import StructuredData from "@/components/StructuredData";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://trills-barber-cave.vercel.app'),
  title: {
    template: '%s | The Barber Cave - Premier Barber Shop in Dallas',
    default: 'The Barber Cave - Premier Barber Shop in Dallas'
  },
  description: "Experience the best barber services in Dallas at The Barber Cave. 8 expert barbers, 29 specialized services including loc services, premium grooming, and flexible scheduling.",
  keywords: "barber shop Dallas, The Barber Cave, luxury grooming, expert barber, fade specialist, loc services, beard grooming, hot towel shave, Dallas haircut, men's grooming Texas, early bird appointments, after hours grooming",
  openGraph: {
    title: "The Barber Cave - Premier Barber Shop in Dallas",
    description: "Experience the best barber services in Dallas at The Barber Cave. 8 expert barbers, 29 specialized services including loc services, premium grooming, and flexible scheduling.",
    type: "website",
    locale: "en_US",
    url: "https://trills-barber-cave.vercel.app",
    siteName: "The Barber Cave",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The Barber Cave - Premier Dallas Barber Shop"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "The Barber Cave - Dallas' Premier Barber Shop",
    description: "Where style meets excellence. Experience luxury grooming with 8 master barbers and 29 specialized services including loc services, premium time slots, and flexible scheduling in Dallas.",
    images: ["/twitter-image.jpg"]
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
    canonical: 'https://trills-barber-cave.vercel.app'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Initialize accessibility checking in development
  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    reportAccessibility(require('react'));
  }

  return (
    <html lang="en">
      <head>
        <StructuredData type="Organization" />
        <StructuredData type="LocalBusiness" />
      </head>
      <body
        className={`${inter.variable} antialiased`}
      >
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
