'use client';

import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import ErrorFallback from './ErrorFallback';

interface SafeComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  componentName?: string;
}

export default function SafeComponent({ 
  children, 
  fallback, 
  onError,
  componentName = 'Component'
}: SafeComponentProps) {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error(`Error in ${componentName}:`, error, errorInfo);
    onError?.(error, errorInfo);
  };

  const customFallback = fallback || (
    <ErrorFallback 
      message={`The ${componentName} component encountered an error`}
      showHomeButton={false}
    />
  );

  return (
    <ErrorBoundary 
      fallback={customFallback}
    >
      {children}
    </ErrorBoundary>
  );
}
