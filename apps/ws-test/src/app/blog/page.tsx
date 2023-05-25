import Link from "next/link"

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-500">
      blog
      <Link href="/">Go to home</Link>
    </main>
  )
}
