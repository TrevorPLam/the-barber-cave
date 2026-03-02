'use cache';

import { cacheTag } from 'next/cache';
import { services } from '@/data/services';

export async function getServicesData() {
  // Services data changes rarely - cached by default
  cacheTag('services');
  return services;
}
