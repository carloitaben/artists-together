"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { useUser } from "~/lib/promises"
import { webSocketQueryOptions } from "~/lib/websocket"
import CursorPresence from "./CursorPresence"

export default function CursorPresenceRoom() {
  const user = useUser()
  const room = useSuspenseQuery(
    webSocketQueryOptions("room:update", {
      count: 0,
      members: [],
    }),
  )

  return room.data.members
    .filter((member) => member.username !== user?.username)
    .map((member) => <CursorPresence key={member.username} {...member} />)
}
