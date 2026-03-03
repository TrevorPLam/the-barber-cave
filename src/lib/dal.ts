import { cache } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

// cache() ensures only one DB/session call per render tree, regardless
// of how many Server Components or Route Handlers call verifySession().
export const verifySession = cache(async () => {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin')
  return session
})

export const verifyAdminSession = cache(async () => {
  const session = await verifySession()
  if (session.user.role !== 'admin') {
    redirect('/')
  }
  return session
})
