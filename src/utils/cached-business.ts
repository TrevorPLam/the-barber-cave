'use cache';

import { cacheTag } from 'next/cache';
import { BUSINESS_INFO } from '@/data/constants';

export async function getBusinessInfo() {
  // Business info changes rarely - cached by default
  cacheTag('business');
  return BUSINESS_INFO;
}
