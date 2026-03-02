export const BUSINESS_INFO = {
  name: 'The Barber Cave',
  tagline: 'Where Style Meets Excellence',
  description: 'Experience the art of barbering at The Barber Cave. Premium cuts, luxury grooming, and master barbers dedicated to your perfect look.',
  location: 'Dallas, Texas',
  fullLocation: 'Dallas, Texas\nDFW Metro Area',
  rating: '4.9',
  totalReviews: '178',
  totalBarbers: '8',
  totalServices: '29',
  newClientDiscount: '$10'
} as const;

export const EXTERNAL_LINKS = {
  booking: 'https://getsquire.com/booking/book/the-barber-cave-dallas',
  services: 'https://getsquire.com/discover/barbershop/the-barber-cave-dallas',
  instagram: 'https://www.instagram.com/the_barbercave_',
  facebook: 'https://www.facebook.com/TrillBarberCave/',
  youtube: 'https://www.youtube.com/@TheBarberCave'
} as const;

export const NAVIGATION_ITEMS = [
  { href: '#services', label: 'Services' },
  { href: '#barbers', label: 'Barbers' },
  { href: '#work', label: 'Our Work' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' }
] as const;
