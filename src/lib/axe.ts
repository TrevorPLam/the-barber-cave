// src/lib/axe.ts — conditionally loaded, never in prod bundle
export async function initAxe() {
  if (process.env.NODE_ENV !== 'development') return
  if (typeof window === 'undefined') return

  const React = (await import('react')).default
  const ReactDOM = (await import('react-dom')).default
  const axe = (await import('@axe-core/react')).default

  axe(React, ReactDOM, 1000)
}
