'use client';

import { AlertTriangle, Home } from 'lucide-react';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  message?: string;
  showHomeButton?: boolean;
}

export default function ErrorFallback({ 
  error, 
  resetError, 
  message = "Something went wrong with this component",
  showHomeButton = true 
}: ErrorFallbackProps) {
  return (
    <div
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      className="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
    >
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-6 h-6 text-red-600" aria-hidden="true" />
      </div>
      
      <h3 id="error-fallback-title" className="text-lg font-semibold text-red-900 mb-2">
        <span className="sr-only">Component Error: </span>
        Component Error
      </h3>
      
      <p id="error-fallback-description" className="text-red-700 mb-4">
        {message}
      </p>

      {process.env.NODE_ENV === 'development' && error && (
        <details className="mb-4 text-left">
          <summary className="cursor-pointer text-sm font-medium text-red-800 mb-2">
            Error Details
          </summary>
          <div className="mt-2 p-3 bg-red-100 rounded text-xs font-mono text-red-600 overflow-auto">
            {error.toString()}
          </div>
        </details>
      )}
      
      <div className="flex gap-3 justify-center">
        {resetError && (
          <button
            onClick={resetError}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Try Again
          </button>
        )}
        
        {showHomeButton && (
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium flex items-center"
          >
            <Home className="w-4 h-4 mr-1" />
            Home
          </button>
        )}
      </div>
    </div>
  );
}
