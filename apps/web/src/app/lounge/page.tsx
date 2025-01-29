import type { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Artists Lounge",
}

export default function Page() {
  if (process.env.NODE_ENV === "production") {
    notFound()
  }

  return <div>lounge</div>
}
