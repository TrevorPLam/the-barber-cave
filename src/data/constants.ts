/**
 * @fileoverview Centralized business constants and configuration data
 * @author Development Team
 * @version 1.0.0
 * @license MIT
 *
 * Contains all static business information, external links, and navigation structure
 * used throughout the application. Centralizes business data for maintainability
 * and provides type-safe constants with comprehensive JSDoc documentation.
 * 
 * Updated for 2026 SSOT patterns with dynamic business metrics integration.
 */

import { barbers } from './barbers';
import { services } from './services';
import { BusinessEngine, BusinessMetrics } from './businessEngine';
import { ENV } from '@/lib/env';

/**
 * @constant {string} SITE_URL
 * @description Canonical website URL for SEO and social sharing
 * Used as base URL for meta tags, sitemaps, and external references
 */
export const SITE_URL = ENV.NEXT_PUBLIC_APP_URL;

/**
 * @constant {BusinessMetrics} BUSINESS_METRICS
 * @description Dynamic business metrics computed from source data
 *
 * Enterprise-grade metrics engine providing real-time business intelligence.
 * All values are computed from source arrays ensuring single source of truth.
 * Used throughout the application for consistent business data.
 */
export const BUSINESS_METRICS: BusinessMetrics = BusinessEngine.getMetrics(barbers, services);

/**
 * @constant {BusinessInfo} BUSINESS_INFO
 * @description Core business information with dynamic metrics integration
 *
 * Legacy business constants maintained for backward compatibility.
 * Dynamic metrics available through BUSINESS_METRICS for new implementations.
 * Combines static business data with computed metrics for flexibility.
 */
export const BUSINESS_INFO = {
  name: 'The Barber Cave',
  tagline: 'Where Style Meets Excellence',
  description: 'Experience luxury grooming at The Barber Cave, Dallas\' premier barbershop. Owned by Trill LadiBarber, a female barber and SMP specialist, offering premium cuts, scalp micropigmentation, and master barber services in an upscale urban environment.',
  location: 'Dallas, Texas',
  fullLocation: 'Dallas, Texas\nDFW Metro Area',
  address: '2629 N Stemmons Fwy, Suite 104, Dallas, TX 75207',
  phone: '(682) 812-4154',
  email: 'Trill_connections@yahoo.com',
  rating: '4.9',
  totalReviews: '194+',
  totalBarbers: String(BUSINESS_METRICS.totalBarbers),
  totalServices: String(BUSINESS_METRICS.totalServices),
  newClientDiscount: '$10',
  owner: {
    name: 'Trevalyn M. Parker',
    professionalAlias: 'Trill LadiBarber',
    title: 'Owner, Master Barber, SMP Artist, Entrepreneur',
    education: 'Texas Barber College graduate',
    experience: '5+ years',
    awards: ['Social Media Influencer of the Year Award', 'Featured twice in Krave Magazine'],
    specializations: ['Scalp Micropigmentation (SMP)', 'Master Barber Services', 'Product Development']
  },
  coordinates: {
    latitude: '32.8062204',
    longitude: '-96.8418925'
  },
  internationalExpansion: {
    london: {
      address: '10A Homsey Green, Beck Row, Bury St. Edmunds, IP28 8AJ, United Kingdom',
      status: 'Active international location'
    }
  },
  productLine: {
    name: 'Magic Drip',
    products: ['Foam wrap solution', 'Pomade', 'Beard growth oil'],
    hashtag: '#magicdrip'
  },
  socialMedia: {
    instagram: ['@trill_ladibarber91', '@the_barbercave_', '@the_barbercave_uk'],
    tiktok: '@trill_ladibarber',
    facebook: 'TrillBarberCave',
    bringWhaChaGot: '@bringwhachagot'
  }
};

// Allowlist of trusted external domains for the barber shop
const ALLOWED_EXTERNAL_DOMAINS = [
  'instagram.com',
  'www.instagram.com',
  'facebook.com',
  'www.facebook.com',
  'google.com',
  'maps.google.com',
  'youtube.com',
  'www.youtube.com',
  'tiktok.com',
  'www.tiktok.com',
  'linktr.ee',
  'getsquire.com'
] as const;

export function validateExternalUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    // Must be https and on the allowlist
    if (parsed.protocol !== 'https:') return null;
    const domain = parsed.hostname.toLowerCase();
    if (ALLOWED_EXTERNAL_DOMAINS.some(d => domain === d)) return url;
    return null;
  } catch {
    return null;
  }
}

/**
 * @constant {ExternalLinks} EXTERNAL_LINKS
 * @description External service URLs and social media links
 *
 * Centralized external links used for booking, services, and social media integration.
 * Ensures consistent linking across components and easy maintenance when URLs change.
 * All links include proper security attributes for external navigation.
 */
export const EXTERNAL_LINKS = {
  booking: 'https://getsquire.com/booking/book/the-barber-cave-dallas?ig_ix=true&owner=shop',
  services: 'https://getsquire.com/discover/barbershop/the-barber-cave-dallas',
  instagram: 'https://www.instagram.com/the_barbercave_',
  facebook: 'https://www.facebook.com/TrillBarberCave/',
  youtube: 'https://www.youtube.com/@TheBarberCave',
  ownerInstagram: 'https://www.instagram.com/trill_ladibarber91',
  londonInstagram: 'https://www.instagram.com/the_barbercave_uk',
  bringWhaChaGot: 'https://www.instagram.com/bringwhachagot',
  ownerTiktok: 'https://www.tiktok.com/@trill_ladibarber',
  linktree: 'https://linktr.ee/Trill_ladibarber'
} as const;

/**
 * @constant {NavigationItem[]} NAVIGATION_ITEMS
 * @description Main navigation menu structure
 *
 * Defines the primary navigation items used in header navigation and mobile menu.
 * Uses anchor links for smooth scrolling to page sections.
 * Order is optimized for user journey and conversion funnel.
 */
export const NAVIGATION_ITEMS = [
  { href: '#services', label: 'Services' },
  { href: '#barbers', label: 'Barbers' },
  { href: '#work', label: 'Our Work' },
  { href: '#community', label: 'Community' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' }
] as const;
