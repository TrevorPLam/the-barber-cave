'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<string | number>;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
  maxRetries: number;
  retryTimeoutId: number | null;
}

class ErrorBoundary extends Component<Props, State> {
  private errorRef = React.createRef<HTMLHeadingElement>();

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }

  // Calculate exponential backoff delay with jitter
  private calculateBackoffDelay(attemptNumber: number): number {
    const baseDelay = 1000; // 1 second base
    const maxDelay = 30000; // 30 second max
    const delay = baseDelay * Math.pow(2, attemptNumber);
    // Add jitter (±25%) to prevent thundering herd
    const jitter = delay * 0.25 * (Math.random() * 2 - 1);
    return Math.min(delay + jitter, maxDelay);
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Intentionally omit retryCount so React merges this with existing state,
    // preserving the retry counter across errors (prevents infinite retry bypass).
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Call the external error handler if provided
    this.props.onError?.(error, errorInfo);

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // In production, you would send this to an error reporting service
    // like Sentry, LogRocket, etc.
    // Example: Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { resetKeys } = this.props;
    const { resetKeys: prevResetKeys } = prevProps;

    // Reset error boundary if resetKeys have changed (length OR values)
    if (resetKeys && prevResetKeys) {
      const lengthChanged = resetKeys.length !== prevResetKeys.length;
      const valuesChanged = !lengthChanged && resetKeys.some((key, index) => key !== prevResetKeys[index]);
      if (lengthChanged || valuesChanged) {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
      }
    }

    // Focus error container when error first occurs for keyboard/screen reader users
    if (!prevState.hasError && this.state.hasError && this.errorRef.current) {
      this.errorRef.current.focus();
    }
  }

  handleReset = () => {
    const newRetryCount = this.state.retryCount + 1;

    // Always update retry count for UI state management
    this.setState({ retryCount: newRetryCount });

    // Prevent infinite retries - show permanent error after 3 attempts
    if (newRetryCount >= 3) {
      // Don't reset error state, just update retry count so UI shows permanent error
      return;
    }

    // Calculate backoff delay for production environments
    const delay = process.env.NODE_ENV === 'production'
      ? this.calculateBackoffDelay(newRetryCount - 1) // -1 because we want delay for this attempt
      : 0; // No delay in development for faster testing

    if (delay === 0) {
      // Instant reset in development
      this.setState({
        hasError: false,
        error: undefined,
        errorInfo: undefined
      });
    } else {
      // Apply backoff delay in production
      setTimeout(() => {
        this.setState({
          hasError: false,
          error: undefined,
          errorInfo: undefined
        });
      }, delay);
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div 
          role="alertdialog"
          aria-modal="true"
          aria-live="assertive"
          aria-labelledby="error-title"
          aria-describedby="error-description"
          className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
        >
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600" aria-hidden="true" />
            </div>
            
            <h1 id="error-title" ref={this.errorRef} tabIndex={-1} className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h1>
            
            <p id="error-description" className="text-gray-700 mb-6">
              {this.state.retryCount >= 3
                ? "We're experiencing technical difficulties. Please refresh the page to try again."
                : "We're sorry, but something unexpected happened. Our team has been notified and is working on a fix."
              }
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                  Error Details (Development Only)
                </summary>
                <div className="mt-2 p-4 bg-gray-100 rounded text-xs font-mono text-red-600 overflow-auto">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.toString()}
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="whitespace-pre-wrap mt-1">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
            
            <div className="space-y-3" role="group" aria-label="Error recovery options">
              {this.state.retryCount < 3 ? (
                <button
                  onClick={this.handleReset}
                  className="w-full flex items-center justify-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                >
                  <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
                  Try Again
                </button>
              ) : (
                <button
                  onClick={() => window.location.reload()}
                  className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                >
                  <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
                  Refresh Page
                </button>
              )}
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
