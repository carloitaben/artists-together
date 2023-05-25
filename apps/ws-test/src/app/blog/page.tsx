import Link from "next/link"

export default function Page() {
  return (
    <main className="bg-gray-500">
      <div className="h-[25vh] bg-gray-600">blog</div>
      <Link href="/">Go to home</Link>
      <div className="h-[25vh] bg-gray-700">blog</div>
      <div className="h-[25vh] bg-gray-800">blog</div>
      <div className="h-[25vh] bg-gray-700">blog</div>
      <div className="h-[25vh] bg-gray-600">blog</div>
      <div className="h-[25vh] bg-gray-500">blog</div>
    </main>
  )
}
