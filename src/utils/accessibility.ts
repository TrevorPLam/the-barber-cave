import type React from 'react'

export const reportAccessibility = async (
  App: typeof React,
  config?: Record<string, unknown>
): Promise<void> => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    try {
      const axe = await import('@axe-core/react')
      const ReactDOM = await import('react-dom')
      
      // Initialize axe-core with React
      axe.default(App, ReactDOM, 1000, config)
    } catch (error) {
      // Silently fail if axe import fails (e.g., in test environments)
      console.warn('Accessibility reporting initialization failed:', error)
    }
  }
}

export default reportAccessibility
