"use client"

import { lazy, startTransition, useState, Suspense } from "react"

import { useOnMatchScreen } from "~/hooks/media"
import { url } from "~/hooks/ws"

const CursorsCanvas = lazy(() => import("./CursorsCanvas"))

type Props = {
  emoji: string
}

export default function Cursors({ emoji }: Props) {
  const [mount, setMount] = useState(false)

  useOnMatchScreen("md", (matches) => {
    startTransition(() => setMount(matches && !!url))
  })

  return <Suspense>{mount && <CursorsCanvas emoji={emoji} />}</Suspense>
}
