/**
 * OpenAPI 3.1 specification for The Barber Cave API.
 *
 * This module exports a complete OpenAPI document describing all available
 * REST endpoints, request/response schemas, and authentication requirements.
 *
 * Served at GET /api/docs as a JSON response.
 */

/** OpenAPI document version */
const OPENAPI_VERSION = '3.1.0' as const;

/** API information */
const API_INFO = {
  title: 'The Barber Cave API',
  version: '1.0.0',
  description:
    'REST API for The Barber Cave — a barber shop booking and management system. ' +
    'Provides endpoints for browsing services and barbers, checking availability, ' +
    'and creating bookings.',
  contact: {
    name: 'The Barber Cave',
    url: 'https://thebarbercave.com',
  },
} as const;

/** Shared error schema */
const errorSchema = {
  type: 'object',
  required: ['error'],
  properties: {
    error: { type: 'string', description: 'Human-readable error message' },
    code: { type: 'string', description: 'Machine-readable error code' },
  },
} as const;

/** Shared rate-limit response */
const rateLimitResponse = {
  description: 'Too Many Requests',
  content: {
    'application/json': {
      schema: errorSchema,
      example: { error: 'Too many requests. Please try again later.', code: 'RATE_LIMITED' },
    },
  },
};

/** Shared server-error response */
const serverErrorResponse = {
  description: 'Internal Server Error',
  content: {
    'application/json': {
      schema: errorSchema,
      example: { error: 'Internal server error', code: 'INTERNAL_ERROR' },
    },
  },
};

/**
 * Complete OpenAPI 3.1 specification document.
 * Type is kept broad so the object can be serialised directly to JSON.
 */
export const apiSpec: Record<string, unknown> = {
  openapi: OPENAPI_VERSION,
  info: API_INFO,
  servers: [
    { url: '/api', description: 'Current environment' },
  ],
  tags: [
    { name: 'Services', description: 'Barber shop service catalogue' },
    { name: 'Barbers', description: 'Staff member profiles' },
    { name: 'Bookings', description: 'Appointment booking management' },
    { name: 'Availability', description: 'Time-slot availability checks' },
  ],
  paths: {
    '/services': {
      get: {
        tags: ['Services'],
        summary: 'List all active services',
        description:
          'Returns all active barber shop services. Responses are cached for 1 hour ' +
          '(Cache-Control: public, s-maxage=3600).',
        operationId: 'listServices',
        responses: {
          '200': {
            description: 'OK',
            headers: {
              'Cache-Control': {
                schema: { type: 'string' },
                description: 'public, s-maxage=3600, stale-while-revalidate=86400',
              },
            },
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['services', 'count', 'timestamp'],
                  properties: {
                    services: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Service' },
                    },
                    count: { type: 'integer' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
          '429': rateLimitResponse,
          '500': serverErrorResponse,
        },
      },
      post: {
        tags: ['Services'],
        summary: 'Create a new service',
        description: 'Creates a new barber shop service. Requires admin authentication.',
        operationId: 'createService',
        security: [{ session: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateServiceRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['service', 'message'],
                  properties: {
                    service: { $ref: '#/components/schemas/Service' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Bad Request — validation error',
            content: {
              'application/json': {
                schema: errorSchema,
                example: { error: 'Invalid request data', code: 'VALIDATION_ERROR' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: errorSchema,
                example: { error: 'Authentication required', code: 'UNAUTHORIZED' },
              },
            },
          },
          '403': {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: errorSchema,
                example: { error: 'Insufficient permissions', code: 'FORBIDDEN' },
              },
            },
          },
          '429': rateLimitResponse,
          '500': serverErrorResponse,
        },
      },
    },
    '/barbers': {
      get: {
        tags: ['Barbers'],
        summary: 'List all active barbers',
        description:
          'Returns all active staff members. Responses are cached for 1 hour.',
        operationId: 'listBarbers',
        responses: {
          '200': {
            description: 'OK',
            headers: {
              'Cache-Control': {
                schema: { type: 'string' },
                description: 'public, s-maxage=3600, stale-while-revalidate=86400',
              },
            },
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['barbers', 'count', 'timestamp'],
                  properties: {
                    barbers: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Barber' },
                    },
                    count: { type: 'integer' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
          '429': rateLimitResponse,
          '500': serverErrorResponse,
        },
      },
      post: {
        tags: ['Barbers'],
        summary: 'Create a new barber profile',
        description: 'Adds a new staff member. Requires admin authentication.',
        operationId: 'createBarber',
        security: [{ session: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateBarberRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['barber', 'message'],
                  properties: {
                    barber: { $ref: '#/components/schemas/Barber' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Bad Request',
            content: { 'application/json': { schema: errorSchema } },
          },
          '401': {
            description: 'Unauthorized',
            content: { 'application/json': { schema: errorSchema } },
          },
          '403': {
            description: 'Forbidden',
            content: { 'application/json': { schema: errorSchema } },
          },
          '409': {
            description: 'Conflict — email already exists',
            content: {
              'application/json': {
                schema: errorSchema,
                example: { error: 'Barber with this email already exists', code: 'CONFLICT' },
              },
            },
          },
          '429': rateLimitResponse,
          '500': serverErrorResponse,
        },
      },
    },
    '/bookings': {
      get: {
        tags: ['Bookings'],
        summary: 'List bookings',
        description:
          'Returns bookings. Pass `customerEmail` to fetch a specific customer\'s bookings ' +
          'without authentication. Authenticated admins/owners can list all bookings.',
        operationId: 'listBookings',
        security: [{ session: [] }, {}],
        parameters: [
          {
            name: 'customerEmail',
            in: 'query',
            description: 'Filter bookings by customer email (no auth required)',
            schema: { type: 'string', format: 'email' },
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Maximum number of results (1–100, default 50)',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 50 },
          },
          {
            name: 'offset',
            in: 'query',
            description: 'Pagination offset',
            schema: { type: 'integer', minimum: 0, default: 0 },
          },
        ],
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['bookings', 'count', 'timestamp'],
                  properties: {
                    bookings: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Booking' },
                    },
                    count: { type: 'integer' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: { 'application/json': { schema: errorSchema } },
          },
          '403': {
            description: 'Forbidden',
            content: { 'application/json': { schema: errorSchema } },
          },
          '429': rateLimitResponse,
          '500': serverErrorResponse,
        },
      },
      post: {
        tags: ['Bookings'],
        summary: 'Create a booking',
        description: 'Books an appointment. Guest bookings are allowed (no auth required).',
        operationId: 'createBooking',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateBookingRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Booking confirmed',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['id', 'status', 'message', 'booking'],
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    status: { type: 'string', enum: ['confirmed'] },
                    message: { type: 'string' },
                    booking: {
                      type: 'object',
                      properties: {
                        date: { type: 'string', format: 'date-time' },
                        time: { type: 'string', example: '14:00' },
                        serviceId: { type: 'string' },
                        barberId: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Bad Request — validation or business-rule error',
            content: { 'application/json': { schema: errorSchema } },
          },
          '409': {
            description: 'Conflict — time slot unavailable',
            content: {
              'application/json': {
                schema: errorSchema,
                example: { error: 'Selected time slot is not available' },
              },
            },
          },
          '429': rateLimitResponse,
          '500': serverErrorResponse,
        },
      },
    },
    '/availability': {
      get: {
        tags: ['Availability'],
        summary: 'Get available time slots',
        description:
          'Returns available appointment slots for a given barber, date, and service.',
        operationId: 'getAvailability',
        parameters: [
          {
            name: 'barberId',
            in: 'query',
            required: true,
            schema: { type: 'string' },
          },
          {
            name: 'date',
            in: 'query',
            required: true,
            description: 'Date in YYYY-MM-DD format',
            schema: { type: 'string', format: 'date', example: '2026-04-01' },
          },
          {
            name: 'serviceId',
            in: 'query',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['availableSlots', 'count', 'timestamp'],
                  properties: {
                    barberId: { type: 'string' },
                    date: { type: 'string', format: 'date' },
                    serviceId: { type: 'string' },
                    availableSlots: {
                      type: 'array',
                      items: { type: 'string', example: '09:00' },
                    },
                    count: { type: 'integer' },
                    businessHours: {
                      type: 'object',
                      properties: {
                        start: { type: 'string' },
                        end: { type: 'string' },
                        daysOff: { type: 'array', items: { type: 'string' } },
                      },
                    },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Bad Request',
            content: { 'application/json': { schema: errorSchema } },
          },
          '404': {
            description: 'Barber or service not found',
            content: { 'application/json': { schema: errorSchema } },
          },
          '429': rateLimitResponse,
          '500': serverErrorResponse,
        },
      },
    },
  },
  components: {
    securitySchemes: {
      session: {
        type: 'apiKey',
        in: 'cookie',
        name: 'next-auth.session-token',
        description: 'NextAuth.js session cookie',
      },
    },
    schemas: {
      Service: {
        type: 'object',
        required: ['id', 'name', 'duration', 'price', 'isActive'],
        properties: {
          id: { type: 'integer' },
          name: { type: 'string', maxLength: 100 },
          description: { type: 'string', nullable: true },
          duration: { type: 'integer', description: 'Duration in minutes' },
          price: { type: 'string', description: 'Decimal string, e.g. "25.00"' },
          isActive: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateServiceRequest: {
        type: 'object',
        required: ['name', 'duration', 'price'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 100 },
          description: { type: 'string' },
          duration: {
            type: 'integer',
            minimum: 5,
            maximum: 480,
            description: 'Duration in minutes',
          },
          price: {
            type: 'string',
            pattern: '^\\d+\\.\\d{2}$',
            description: 'Decimal string, e.g. "25.00"',
          },
        },
      },
      Barber: {
        type: 'object',
        required: ['id', 'name', 'email', 'isActive'],
        properties: {
          id: { type: 'integer' },
          name: { type: 'string', maxLength: 100 },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string', nullable: true },
          bio: { type: 'string', nullable: true },
          avatar: { type: 'string', format: 'uri', nullable: true },
          isActive: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateBarberRequest: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 100 },
          email: { type: 'string', format: 'email', maxLength: 255 },
          phone: { type: 'string' },
          bio: { type: 'string' },
          avatar: { type: 'string', format: 'uri' },
        },
      },
      Booking: {
        type: 'object',
        required: ['id', 'customerName', 'customerEmail', 'serviceId', 'barberId', 'date', 'time', 'status'],
        properties: {
          id: { type: 'string', format: 'uuid' },
          customerName: { type: 'string' },
          customerEmail: { type: 'string', format: 'email' },
          customerPhone: { type: 'string', nullable: true },
          serviceId: { type: 'integer' },
          barberId: { type: 'integer' },
          date: { type: 'string', format: 'date-time' },
          time: { type: 'string', pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$', example: '14:00' },
          duration: { type: 'integer', description: 'Duration in minutes' },
          price: { type: 'string', description: 'Decimal string' },
          status: {
            type: 'string',
            enum: ['confirmed', 'completed', 'cancelled', 'no_show'],
          },
          notes: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateBookingRequest: {
        type: 'object',
        required: ['serviceId', 'barberId', 'date', 'time', 'customerInfo'],
        properties: {
          serviceId: { type: 'string', format: 'uuid' },
          barberId: { type: 'string', format: 'uuid' },
          date: { type: 'string', format: 'date-time' },
          time: {
            type: 'string',
            pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$',
            example: '14:00',
          },
          customerInfo: {
            type: 'object',
            required: ['name', 'email', 'phone'],
            properties: {
              name: { type: 'string', minLength: 1, maxLength: 100 },
              email: { type: 'string', format: 'email' },
              phone: { type: 'string' },
              notes: { type: 'string', maxLength: 500 },
            },
          },
        },
      },
    },
  },
};
