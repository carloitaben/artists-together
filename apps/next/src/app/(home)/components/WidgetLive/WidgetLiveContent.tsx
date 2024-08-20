"use client"

import { oneOf } from "@artists-together/core/utils"
import { useInView } from "framer-motion"
import { use, useMemo, useRef } from "react"
import type { getRandomLiveUsers } from "~/services/live-user/server"

type Props = {
  usersPromise: ReturnType<typeof getRandomLiveUsers>
}

export default function WidgetLiveContent({ usersPromise }: Props) {
  const users = use(usersPromise)
  const ref = useRef(null)
  const inView = useInView(ref, {
    once: true,
    amount: "some",
  })

  const src = useMemo(() => {
    if (!users.length) return

    const user = oneOf(users)
    const url = new URL("https://player.twitch.tv")

    url.searchParams.set("channel", new URL(user.url).pathname.slice(1))
    url.searchParams.append("parent", "artiststogether.online")
    url.searchParams.append("parent", "localhost")
    url.searchParams.set("muted", "true")

    return url.href
  }, [users])

  return (
    <div className="size-full" ref={ref}>
      {users.length && inView ? (
        <iframe src={src} height="100%" className="size-full object-cover" />
      ) : null}
    </div>
  )
}
