import type { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Artist Raid Train",
}

export default function Page() {
  if (process.env.NODE_ENV === "production") {
    notFound()
  }

  return <div>art</div>
}
