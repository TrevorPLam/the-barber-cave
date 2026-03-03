// src/components/OptimizedImage.tsx - Advanced image optimization with Next.js Image Component
import Image from 'next/image'
import { useState } from 'react'

interface OptimizedHeroImageProps {
  src: string
  alt: string
  priority?: boolean
  className?: string
  width?: number
  height?: number
  fill?: boolean
  sizes?: string
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

/**
 * Advanced image component with priority and placeholder optimization
 *
 * Features:
 * - Priority loading for LCP elements
 * - Quality optimization (default 85)
 * - Responsive sizes for different breakpoints
 * - Blur placeholder for raster images
 * - Error handling with fallback
 * - Transition effects
 */
export default function OptimizedImage({
  src,
  alt,
  priority = false,
  className = '',
  width,
  height,
  fill = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  quality = 85,
  placeholder = 'blur',
  blurDataURL,
  ...props
}: OptimizedHeroImageProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  if (hasError) {
    // Fallback for broken images
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center text-gray-400 text-sm ${className}`}
        style={{ width, height }}
        role="img"
        aria-label={`Failed to load image: ${alt}`}
      >
        Image unavailable
      </div>
    )
  }

  return (
    <div className={`relative ${fill ? 'w-full h-full' : ''} ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority} // Use priority for LCP elements
        quality={quality} // Balance quality vs file size
        sizes={sizes}
        placeholder={placeholder} // Only for raster images, not SVG
        blurDataURL={blurDataURL} // Base64 blur placeholder
        className={`transition-transform duration-300 group-hover:scale-105 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onError={(e) => {
          // Fallback handling
          const target = e.target as HTMLImageElement
          target.src = '/images/fallback.jpg'
          setHasError(true)
        }}
        onLoad={() => setIsLoading(false)}
        {...props}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
    </div>
  )
}
