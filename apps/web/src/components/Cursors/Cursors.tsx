"use client"

import { User } from "lucia"
import { lazy, startTransition, useState, Suspense } from "react"

import { useOnMatchScreen } from "~/hooks/media"
import { url } from "~/hooks/ws"

const CursorsCanvas = lazy(() => import("./CursorsCanvas"))

type Props = {
  user: User | undefined
}

export default function Cursors({ user }: Props) {
  const [mount, setMount] = useState(false)

  useOnMatchScreen("md", (matches) => {
    startTransition(() => setMount(matches && !!url))
  })

  return <Suspense>{mount && <CursorsCanvas user={user} />}</Suspense>
}
