'use client';

import React, { Component, ErrorInfo, ReactNode, RefObject, useState, useRef } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Sentry } from '@/lib/sentry';
import { useAnnouncement } from '@/hooks/useAnnouncement';
import { useFocusTrap } from '@/hooks/useFocusTrap';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<string | number>;
}

// Internal props extend the public API with hook-provided functionality
interface InnerProps extends Props {
  announce: (message: string, options?: { politeness?: 'polite' | 'assertive' | 'off'; timeout?: number }) => void;
  containerRef: RefObject<HTMLElement>;
  onErrorDetected: () => void;
  onResetComplete: () => void;
  /** Registers the class instance's reset handler so the focus trap's Escape key can invoke it */
  setEscapeResetFn: (fn: (() => void) | null) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
  maxRetries: number;
  retryTimeoutId: number | null;
}

class ErrorBoundaryCore extends Component<InnerProps, State> {
  private errorRef = React.createRef<HTMLHeadingElement>();

  constructor(props: InnerProps) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }

  componentDidMount() {
    // Expose handleReset to the functional wrapper so Escape key can trigger it
    this.props.setEscapeResetFn(this.handleReset);
  }

  componentWillUnmount() {
    this.props.setEscapeResetFn(null);
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

  // Sanitize error messages for safe display in production
  private sanitizeError(message: string): string {
    return message
      .replace(/[\w\-./]+\.(ts|tsx|js|jsx|mjs|cjs):\d+:\d+/g, '') // Remove file paths with line numbers
      .replace(/^\s*at\s.*$/gm, '') // Remove stack trace "at ..." lines
      .trim()
      .slice(0, 200); // Limit message length
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Intentionally omit retryCount so React merges this with existing state,
    // preserving the retry counter across errors (prevents infinite retry bypass).
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });

    // Call the external error handler if provided
    this.props.onError?.(error, errorInfo);

    // Notify the functional wrapper so it can activate the focus trap
    this.props.onErrorDetected();

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Send to Sentry for production error monitoring
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureException(error, {
        contexts: { react: { componentStack: errorInfo.componentStack } },
      });
    }

    // Announce error to screen readers immediately (assertive)
    this.props.announce('An error occurred. Use the Try Again button to recover.', {
      politeness: 'assertive',
    });
  }

  componentDidUpdate(prevProps: InnerProps, prevState: State) {
    const { resetKeys } = this.props;
    const { resetKeys: prevResetKeys } = prevProps;

    // Reset error boundary if resetKeys have changed (length OR values)
    if (resetKeys && prevResetKeys) {
      const lengthChanged = resetKeys.length !== prevResetKeys.length;
      const valuesChanged = !lengthChanged && resetKeys.some((key, index) => key !== prevResetKeys[index]);
      if (lengthChanged || valuesChanged) {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
        this.props.onResetComplete();
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
      this.props.announce('Maximum retry attempts reached. Please refresh the page.', {
        politeness: 'assertive',
      });
      return;
    }

    // Announce retry attempt to screen readers
    this.props.announce(`Retrying… attempt ${newRetryCount} of 3.`, { politeness: 'polite' });

    // Calculate backoff delay for production environments
    const delay = process.env.NODE_ENV === 'production'
      ? this.calculateBackoffDelay(newRetryCount - 1) // -1 because we want delay for this attempt
      : 0; // No delay in development for faster testing

    const doReset = () => {
      this.setState({ hasError: false, error: undefined, errorInfo: undefined });
      this.props.onResetComplete();
    };

    if (delay === 0) {
      doReset();
    } else {
      setTimeout(doReset, delay);
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI — attach containerRef for focus trapping
      return (
        <div
          ref={this.props.containerRef as RefObject<HTMLDivElement>}
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
            {process.env.NODE_ENV === 'production' && this.state.error && (
              <p className="sr-only">
                {this.sanitizeError(this.state.error.message)}
              </p>
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

/**
 * ErrorBoundary — functional wrapper that supplies the useAnnouncement and
 * useFocusTrap hooks to the class-based error boundary core.
 */
export default function ErrorBoundary(props: Props) {
  const [hasError, setHasError] = useState(false);
  const { announce } = useAnnouncement();
  // Holds the class instance's handleReset so the Escape key can invoke it
  const escapeResetRef = useRef<(() => void) | null>(null);
  const containerRef = useFocusTrap({
    isActive: hasError,
    onEscape: () => escapeResetRef.current?.(),
  });

  return (
    <ErrorBoundaryCore
      {...props}
      announce={announce}
      containerRef={containerRef}
      onErrorDetected={() => setHasError(true)}
      onResetComplete={() => setHasError(false)}
      setEscapeResetFn={(fn) => { escapeResetRef.current = fn; }}
    />
  );
}
