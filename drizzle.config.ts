// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'
import { ENV } from './src/lib/env'

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: ENV.DATABASE_URL,
  },
  verbose: true,
  strict: true,
})
