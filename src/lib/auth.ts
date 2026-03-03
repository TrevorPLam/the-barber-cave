import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(128),
})

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const { email, password } = loginSchema.parse(credentials)

          // Single admin account — no user table needed for barber shop
          if (
            email === process.env.ADMIN_EMAIL &&
            await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH!)
          ) {
            return { id: 'admin', email, name: 'Admin', role: 'admin' }
          }
          return null
        } catch {
          return null // Zod parse error = invalid input = null (not thrown)
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,       // 24h absolute expiry
    updateAge: 30 * 60,          // silent refresh every 30min of activity
  },
  jwt: {
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as any).role
      return token
    },
    session({ session, token }) {
      if (session.user) session.user.role = token.role as string
      return session
    },
  },
  pages: { signIn: '/auth/signin' },
}
