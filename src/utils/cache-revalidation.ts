import { revalidateTag } from 'next/cache';

/**
 * Cache revalidation utilities for Next.js 16 Cache Components
 * Use these functions to manually invalidate cached data when updates occur
 */

export function revalidateServicesCache() {
  revalidateTag('services', 'max');
}

export function revalidateBarbersCache() {
  revalidateTag('barbers', 'max');
}

export function revalidateBusinessCache() {
  revalidateTag('business', 'max');
}

export function revalidateAllCaches() {
  revalidateServicesCache();
  revalidateBarbersCache();
  revalidateBusinessCache();
}

/**
 * Example usage in API routes or server actions:
 * 
 * import { revalidateServicesCache } from '@/utils/cache-revalidation';
 * 
 * export async function POST(request: Request) {
 *   // Update services data
 *   await updateServicesData();
 *   
 *   // Revalidate cache
 *   revalidateServicesCache();
 *   
 *   return Response.json({ success: true });
 * }
 */
