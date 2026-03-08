import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center rounded-[1px] border-[10px] mt-0 text-[#5f6895]">
      <h1 className="text-[45px] font-bold mb-4">Boardly</h1>
      <p className="text-muted-foreground mb-8">Work management platform</p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 text-[18px] border border-dotted border-[#3253b3]"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="px-6 py-2 bg-secondary text-secondary-foreground rounded-md hover:opacity-90 text-[18px] border border-dotted border-[#3253b3]"
        >
          Register
        </Link>
      </div>
    </div>
  )
}