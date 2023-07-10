"use client"

import { lazy, startTransition, useState, Suspense } from "react"

import { User } from "~/services/auth"
import { useOnMatchScreen } from "~/hooks/media"
import { url } from "~/hooks/ws"

const CursorsCanvas = lazy(() => import("./CursorsCanvas"))

type Props = {
  user: User
}

export default function Cursors({ user }: Props) {
  const [mount, setMount] = useState(false)

  useOnMatchScreen("md", (matches) => {
    startTransition(() => setMount(matches && !!url))
  })

  return <Suspense>{mount && <CursorsCanvas user={user} />}</Suspense>
}
