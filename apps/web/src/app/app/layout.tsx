'use client'

import { Providers } from '@/components/providers'
import { ToastProvider } from '@/components/ui/toast'
import { Sidebar } from '@/components/sidebar'
import { ErrorBoundary } from '@/components/error-boundary'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <ToastProvider>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 md:ml-64">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
        </div>
      </ToastProvider>
    </Providers>
  )
}
