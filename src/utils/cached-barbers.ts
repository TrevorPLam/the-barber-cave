'use cache';

import { cacheTag } from 'next/cache';
import { barbers } from '@/data/barbers';

export async function getBarbersData() {
  // Barber data changes occasionally - cached by default
  cacheTag('barbers');
  return barbers;
}
