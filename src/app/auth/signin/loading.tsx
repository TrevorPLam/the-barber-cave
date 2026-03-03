/** Sign-in page loading skeleton shown during navigation. */
export default function SignInLoading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
      role="status"
      aria-label="Loading sign in page"
    >
      <div className="max-w-md w-full space-y-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto" aria-hidden="true" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" aria-hidden="true" />
        <div className="mt-8 space-y-4">
          <div className="h-10 bg-gray-200 rounded-t-md" aria-hidden="true" />
          <div className="h-10 bg-gray-200 rounded-b-md" aria-hidden="true" />
          <div className="h-12 bg-gray-300 rounded-full mt-4" aria-hidden="true" />
        </div>
        <p className="sr-only">Loading…</p>
      </div>
    </div>
  );
}
