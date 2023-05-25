"use client"

import { lazy, startTransition, useState, Suspense } from "react"
import { useOnMatchMedia } from "~/hooks/media"

const CursorCanvas = lazy(() => import("./CursorCanvas"))

export default function Cursors() {
  const [mount, setMount] = useState(false)

  useOnMatchMedia("(pointer: fine)", (matches) => {
    startTransition(() => setMount(matches))
  })

  return <Suspense>{mount && <CursorCanvas />}</Suspense>
}
