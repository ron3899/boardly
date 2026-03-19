import { redirect } from 'next/navigation'

export default function Home() {
  // Immediately redirect to boards - no login required
  redirect('/app/boards')
}
