export interface Barber {
  id: string;
  name: string;
  title: string;
  rating: string;
  reviews: string;
  available: string;
}

export const barbers: Barber[] = [
  {
    id: 'trill-l',
    name: 'Trill L.',
    title: 'Master Barber',
    rating: '4.8',
    reviews: '82',
    available: 'Available Friday'
  },
  {
    id: 'charlo-f',
    name: 'Charlo F.',
    title: 'Fade Specialist',
    rating: '5.0',
    reviews: '28',
    available: 'Tomorrow'
  },
  {
    id: 'daplug-jcox',
    name: 'Daplug_jcox',
    title: 'Expert Barber',
    rating: '5.0',
    reviews: '39',
    available: 'Tomorrow'
  },
  {
    id: 'tru-b',
    name: 'Tru B.',
    title: 'Blend Specialist',
    rating: 'No ratings',
    reviews: '0',
    available: 'Today'
  },
  {
    id: 'shay-25',
    name: 'Shay',
    title: 'Loc Specialist',
    rating: '5.0',
    reviews: '16',
    available: 'Tomorrow'
  },
  {
    id: 'rob-pro_edge_cutz',
    name: 'Rob Pro_edge_cutz',
    title: 'Master Barber',
    rating: '5.0',
    reviews: '0',
    available: 'Today'
  },
  {
    id: 'lee-thebarber',
    name: 'Lee T.',
    title: 'VIP Specialist',
    rating: '5.0',
    reviews: '13',
    available: 'Tomorrow'
  },
  {
    id: 'larro-cuts',
    name: 'Larro C.',
    title: 'Expert Barber',
    rating: '5.0',
    reviews: '14',
    available: 'Tomorrow'
  }
];
