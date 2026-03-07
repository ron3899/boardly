import type { Metadata } from 'next'
import { Figtree } from 'next/font/google'
import './globals.css'

// Monday.com uses Figtree as their platform font
const figtree = Figtree({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Boardly',
  description: 'Work management platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={figtree.className}>{children}</body>
    </html>
  )
}
