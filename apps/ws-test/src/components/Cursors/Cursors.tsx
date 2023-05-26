"use client"

import { lazy, startTransition, useState, Suspense } from "react"
import { useOnMatchMedia } from "~/hooks/media"

const CursorsCanvas = lazy(() => import("./CursorsCanvas"))

export default function Cursors() {
  const [mount, setMount] = useState(false)

  useOnMatchMedia("(pointer: fine)", (matches) => {
    startTransition(() => setMount(matches))
  })

  return <Suspense>{mount && <CursorsCanvas />}</Suspense>
}
