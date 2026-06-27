'use client';

/**
 * Global error boundary for the root layout.
 * This catches errors that occur in the root layout itself,
 * which the locale-level error.tsx cannot handle.
 *
 * Note: global-error.tsx must define its own <html> and <body> tags
 * since it replaces the root layout when active.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div
          style={{
            display: 'flex',
            minHeight: '100vh',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>
            Something went wrong
          </h1>
          <p style={{ color: '#666', maxWidth: '400px', textAlign: 'center' }}>
            An unexpected error occurred. Please try again.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '0.375rem',
              border: '1px solid #e5e7eb',
              backgroundColor: '#000',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
