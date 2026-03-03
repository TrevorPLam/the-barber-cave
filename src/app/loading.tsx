/** Global loading skeleton shown by Next.js App Router during page transitions. */
export default function Loading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-white"
      role="status"
      aria-label="Loading page"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin" aria-hidden="true" />
        <p className="text-gray-600 text-sm font-medium">Loading…</p>
      </div>
    </div>
  );
}
