"use client"

import { lazy, startTransition, useState, Suspense } from "react"

import { useOnMatchScreen } from "~/hooks/media"

const CursorsCanvas = lazy(() => import("./CursorsCanvas"))

export default function Cursors() {
  const [mount, setMount] = useState(false)

  useOnMatchScreen("md", (matches) => {
    startTransition(() => setMount(matches))
  })

  return <Suspense>{mount && <CursorsCanvas />}</Suspense>
}
