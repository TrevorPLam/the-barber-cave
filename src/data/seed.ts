// src/data/seed.ts - Database seeding for development
import { serviceRepository } from '../lib/repositories/service-repository'
import { barberRepository } from '../lib/repositories/barber-repository'

export async function seedDatabase() {
  console.log('🌱 Seeding database...')

  // Seed services
  const services = [
    {
      name: 'Classic Haircut',
      description: 'Traditional haircut with scissors and clippers',
      duration: 30,
      price: '25.00',
    },
    {
      name: 'Premium Haircut & Style',
      description: 'Advanced haircut with styling and finishing',
      duration: 45,
      price: '40.00',
    },
    {
      name: 'Hot Towel Shave',
      description: 'Traditional straight razor shave with hot towel',
      duration: 30,
      price: '35.00',
    },
    {
      name: 'Beard Trim & Shape',
      description: 'Professional beard grooming and shaping',
      duration: 20,
      price: '20.00',
    },
    {
      name: 'Haircut & Beard Combo',
      description: 'Complete grooming package with haircut and beard',
      duration: 60,
      price: '50.00',
    },
  ]

  for (const service of services) {
    try {
      await serviceRepository.create(service)
      console.log(`✅ Created service: ${service.name}`)
    } catch (error) {
      console.log(`⚠️ Service already exists: ${service.name}`)
    }
  }

  // Seed barbers
  const barbers = [
    {
      name: 'Marcus Johnson',
      email: 'marcus@barbercave.com',
      phone: '555-0101',
      bio: 'Master barber with 10+ years experience specializing in modern cuts and traditional shaves.',
    },
    {
      name: 'Sarah Chen',
      email: 'sarah@barbercave.com',
      phone: '555-0102',
      bio: 'Creative stylist known for precision cuts and innovative styling techniques.',
    },
    {
      name: 'David Rodriguez',
      email: 'david@barbercave.com',
      phone: '555-0103',
      bio: 'Beard specialist and traditional barber with expertise in classic and modern styles.',
    },
  ]

  for (const barber of barbers) {
    try {
      await barberRepository.create(barber)
      console.log(`✅ Created barber: ${barber.name}`)
    } catch (error) {
      console.log(`⚠️ Barber already exists: ${barber.name}`)
    }
  }

  console.log('🎉 Database seeding complete!')
}
