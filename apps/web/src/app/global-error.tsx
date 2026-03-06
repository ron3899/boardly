'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div style={{
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Something went wrong!
            </h2>
            <p style={{ marginBottom: '1.5rem', color: '#666' }}>
              {error.message || 'An unexpected error occurred. Please try refreshing the page.'}
            </p>
            <button
              onClick={() => reset()}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
