import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import AccessibilityProvider from "@/components/AccessibilityProvider";
import StructuredData from "@/components/StructuredData";
import { SITE_URL, BUSINESS_INFO } from "@/data/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: '%s | The Barber Cave - Premier Barber Shop in Dallas',
    default: 'The Barber Cave - Premier Barber Shop in Dallas'
  },
  description: `Experience the best barber services in Dallas at The Barber Cave. ${BUSINESS_INFO.totalBarbers} expert barbers, ${BUSINESS_INFO.totalServices} specialized services including loc services, premium grooming, and flexible scheduling.`,
  keywords: "barber shop Dallas, The Barber Cave, luxury grooming, expert barber, fade specialist, loc services, beard grooming, hot towel shave, Dallas haircut, men's grooming Texas, early bird appointments, after hours grooming",
  openGraph: {
    title: "The Barber Cave - Premier Barber Shop in Dallas",
    description: `Experience the best barber services in Dallas at The Barber Cave. ${BUSINESS_INFO.totalBarbers} expert barbers, ${BUSINESS_INFO.totalServices} specialized services including loc services, premium grooming, and flexible scheduling.`,
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "The Barber Cave",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Barber Cave - Dallas' Premier Barber Shop",
    description: `Where style meets excellence. Experience luxury grooming with ${BUSINESS_INFO.totalBarbers} master barbers and ${BUSINESS_INFO.totalServices} specialized services including loc services, premium time slots, and flexible scheduling in Dallas.`,
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
        <StructuredData type="Organization" />
        <StructuredData type="LocalBusiness" />
      </head>
      <body
        className={`${inter.variable} antialiased`}
      >
        <ErrorBoundary>
          <AccessibilityProvider />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
