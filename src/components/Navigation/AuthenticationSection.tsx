/**
 * AuthenticationSection renders sign-in / sign-out controls.
 *
 * Handles three states: loading, authenticated (shows user info + sign-out),
 * and unauthenticated (shows sign-in button).
 *
 * @example
 * ```tsx
 * <AuthenticationSection
 *   session={session}
 *   status={status}
 *   onSignOut={handleSignOut}
 * />
 * ```
 *
 * @accessibility
 * - Buttons include descriptive aria-labels
 * - Loading state uses an animated placeholder (no text needed)
 */

import { memo } from 'react';
import { User, LogOut } from 'lucide-react';
import { signIn } from 'next-auth/react';
import type { Session } from 'next-auth';

interface AuthenticationSectionProps {
  /** Current session data (null when unauthenticated) */
  session: Session | null;
  /** Session loading status */
  status: 'loading' | 'authenticated' | 'unauthenticated';
  /** Called when the user clicks sign-out */
  onSignOut: () => void;
}

const AuthenticationSection = memo(function AuthenticationSection({
  session,
  status,
  onSignOut,
}: AuthenticationSectionProps) {
  if (status === 'loading') {
    return <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />;
  }

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm">
          <User className="h-4 w-4" />
          <span className="font-medium">{session.user?.name || session.user?.email}</span>
        </div>
        <button
          onClick={onSignOut}
          className="flex items-center space-x-1 text-gray-700 hover:text-black transition-colors"
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn()}
      className="flex items-center space-x-1 text-gray-700 hover:text-black transition-colors"
      aria-label="Sign in"
    >
      <User className="h-4 w-4" />
      <span>Sign in</span>
    </button>
  );
});

export default AuthenticationSection;
