import type { Metadata } from "next"
import { Suspense } from "react"
import ClientOnly from "~/components/ClientOnly"

export const metadata: Metadata = {
  title: "Artists Lounge",
}

export default function Page() {
  return (
    <div>
      <Suspense fallback={<div>server only</div>}>
        <ClientOnly>
          <div>loiunge</div>
        </ClientOnly>
      </Suspense>
    </div>
  )
}
