export interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  icon: string;
}

export const services: Service[] = [
  {
    id: 'ultimate-grooming',
    title: 'Ultimate Grooming (with beard)',
    description: 'Deep cleanse exfoliating facial, shampoo, beard wash, haircut of choice, magic drip',
    price: '$100',
    duration: '2 hours',
    icon: 'Crown'
  },
  {
    id: 'presidential-service',
    title: 'Presidential Service (no beard)',
    description: 'Deep cleanse hot towel Facial, shampoo, haircut of choice, magic drip, razor, enhancements (if you have a beard please book ultimate grooming service)',
    price: '$80',
    duration: '1.5 hours',
    icon: 'Scissors'
  },
  {
    id: 'bald-bearded-deluxe',
    title: 'Bald & Bearded DELUXE',
    description: 'Warm lather hot towel head razor shave, beard wash, lining and shaping for the complete look',
    price: '$50-$70',
    duration: '1 hour',
    icon: 'Star'
  },
  {
    id: 'bald-bearded-standard',
    title: 'Bald & Bearded STANDARD',
    description: 'Clipper head shave & hot towel razor beard lining & shaping',
    price: '$40-$55',
    duration: '45 min',
    icon: 'Zap'
  },
  {
    id: 'mens-haircut',
    title: "Men's Haircut",
    description: 'Professional haircut without beard service, precision cutting and styling',
    price: '$40-$60',
    duration: '45-60 min',
    icon: 'Users'
  },
  {
    id: 'haircut-beard',
    title: 'Men\'s Haircut with Beard',
    description: 'Complete service including haircut and beard grooming with or without enhancements',
    price: '$45-$65',
    duration: '60-75 min',
    icon: 'Award'
  },
  {
    id: 'haircut-beard-wash',
    title: 'Men\'s Haircut with Beard Wash & grooming',
    description: 'Haircut with beard wash, line up, products & enhancements',
    price: '$50-$65',
    duration: '1-1.25 hours',
    icon: 'Sparkles'
  },
  {
    id: 'new-client-special',
    title: 'New Client Special $10 Off',
    description: '$10 off any service except edge ups. Price will be adjusted in person. 1st timers only!',
    price: '$10 OFF',
    duration: 'First visit',
    icon: 'ChevronRight'
  },
  {
    id: 'trill-sophisticated',
    title: 'Trill Sophisticated Package',
    description: 'Shampoo, Haircut, Hot Towel & Lather Razor Line Up & Mustache/Goatee, Enhancements, Exfoliating Facial and Massage',
    price: '$100',
    duration: '1.25 hours',
    icon: 'Gem'
  },
  {
    id: 'trill-sophisticated-beard',
    title: 'Trill Sophisticated Package W/ Beard',
    description: 'Shampoo, Haircut, Hot Towel & Lather Razor Line Up, Beard Wash, Beard Hot Comb, Enhancements, Exfoliating Facial and Massage',
    price: '$120',
    duration: '1.5 hours',
    icon: 'Crown'
  },
  {
    id: 'beard-grooming-facial',
    title: 'Beard Grooming + Facial Mask',
    description: 'Beard grooming with facial mask treatment',
    price: '$40',
    duration: '45 min',
    icon: 'Heart'
  },
  {
    id: 'edge-up-only',
    title: 'Edge Up hairline ONLY',
    description: 'Edge up hair & neck line only',
    price: '$25-$30',
    duration: '30 min',
    icon: 'Target'
  },
  {
    id: 'beard-lineup',
    title: 'Beard Line up (no wash)',
    description: 'Beard Line up only hot towel treatment with razor & enhancements',
    price: '$30-$40',
    duration: '30 min',
    icon: 'Move'
  },
  {
    id: 'kids-haircut',
    title: 'Kids Haircut',
    description: 'Professional haircut for children K-17',
    price: '$30',
    duration: '30 min',
    icon: 'Smile'
  },
  {
    id: 'womens-haircut',
    title: 'Women\'s haircut',
    description: 'Professional women\'s haircut service',
    price: '$50',
    duration: '1 hour',
    icon: 'Flower'
  },
  {
    id: 'vip-off-day',
    title: 'VIP off day cuts',
    description: 'VIP service on off days - call for booking',
    price: '$100',
    duration: '1 hour',
    icon: 'Diamond'
  },
  {
    id: 'early-bird-special',
    title: 'Early Bird (6am-7am)',
    description: 'Any cut before 8am - BOOK 24 HRS IN ADVANCE',
    price: '$75',
    duration: '1 hour',
    icon: 'Sun'
  },
  {
    id: 'after-hours-7pm',
    title: 'After hours 7pm-8pm',
    description: 'Premium after-hours service',
    price: '$65',
    duration: '1 hour',
    icon: 'Moon'
  },
  {
    id: 'after-hours-8pm',
    title: 'After hours 8pm-9pm',
    description: 'Premium late evening service',
    price: '$70',
    duration: '1 hour',
    icon: 'Moon'
  },
  {
    id: 'after-hours-9pm',
    title: 'After hours 9pm-10pm',
    description: 'Premium late night service',
    price: '$80',
    duration: '1 hour',
    icon: 'Moon'
  },
  {
    id: 'loc-retwist',
    title: 'Loc Retwist',
    description: 'Professional loc retwisting service',
    price: '$75',
    duration: '1 hour',
    icon: 'RefreshCw'
  },
  {
    id: 'loc-retwist-style',
    title: 'Loc Retwist/Style',
    description: 'Loc retwist with styling service',
    price: '$85',
    duration: '1h 15min',
    icon: 'Sparkles'
  },
  {
    id: 'loc-detox',
    title: 'Loc Detox',
    description: 'Deep cleansing loc detox treatment',
    price: '$40',
    duration: '30 min',
    icon: 'Wind'
  },
  {
    id: 'loc-bleach',
    title: 'Loc Bleach (Semi Color On Ends)',
    description: 'Semi color application on loc ends',
    price: '$75',
    duration: '2 hours',
    icon: 'Droplet'
  },
  {
    id: 'loc-retie-interlock',
    title: 'Loc retie/interlock',
    description: 'Loc retie/interlock service - price varies by loc size',
    price: '$85+',
    duration: '1h 30min',
    icon: 'Link'
  },
  {
    id: 'starter-locks',
    title: 'Starter Locks',
    description: 'Professional starter loc installation',
    price: '$85',
    duration: '1 hour',
    icon: 'Plus'
  },
  {
    id: 'two-strand-twist',
    title: '2 Strand Twist with shampoo',
    description: 'Two-strand twist with shampoo service',
    price: '$85',
    duration: '1h 15min',
    icon: 'RotateCcw'
  },
  {
    id: 'two-strand-twist-blowout',
    title: '2 strand twist with shampoo and blow out',
    description: 'Two-strand twist with shampoo and blowout styling',
    price: '$115',
    duration: '2h 15min',
    icon: 'Wind'
  }
];
