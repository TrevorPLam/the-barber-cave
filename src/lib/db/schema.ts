// src/lib/db/schema.ts
import { pgTable, serial, text, integer, timestamp, boolean, decimal, uuid, varchar } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Services table - barber shop services
export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  duration: integer('duration').notNull(), // minutes
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Barbers table - staff members
export const barbers = pgTable('barbers', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }),
  bio: text('bio'),
  avatar: text('avatar'), // URL to profile image
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Bookings table - appointment bookings
export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerName: varchar('customer_name', { length: 100 }).notNull(),
  customerEmail: varchar('customer_email', { length: 255 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 20 }),
  serviceId: integer('service_id').notNull().references(() => services.id),
  barberId: integer('barber_id').notNull().references(() => barbers.id),
  date: timestamp('date').notNull(),
  time: varchar('time', { length: 5 }).notNull(), // HH:MM format
  duration: integer('duration').notNull(), // minutes
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 20 }).default('confirmed').notNull(), // confirmed, completed, cancelled, no_show
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Relations
export const servicesRelations = relations(services, ({ many }) => ({
  bookings: many(bookings),
}))

export const barbersRelations = relations(barbers, ({ many }) => ({
  bookings: many(bookings),
}))

export const bookingsRelations = relations(bookings, ({ one }) => ({
  service: one(services, {
    fields: [bookings.serviceId],
    references: [services.id],
  }),
  barber: one(barbers, {
    fields: [bookings.barberId],
    references: [barbers.id],
  }),
}))

// Types
export type Service = typeof services.$inferSelect
export type NewService = typeof services.$inferInsert

export type Barber = typeof barbers.$inferSelect
export type NewBarber = typeof barbers.$inferInsert

export type Booking = typeof bookings.$inferSelect
export type NewBooking = typeof bookings.$inferInsert
