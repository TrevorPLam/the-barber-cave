'use client'

import { useEffect } from 'react'

export default function AxeLoader() {
  useEffect(() => {
    import('@/lib/axe').then(({ initAxe }) => initAxe())
  }, [])

  return null
}
