import Link from "next/link"

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      home
      <Link href="/blog">Go to blog</Link>
    </main>
  )
}
