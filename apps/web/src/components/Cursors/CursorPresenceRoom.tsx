"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { userQueryOptions } from "~/features/auth/shared"
import { webSocketQueryOptions } from "~/lib/websocket"
import CursorPresence from "./CursorPresence"

export default function CursorPresenceRoom() {
  const user = useSuspenseQuery(userQueryOptions)
  const room = useSuspenseQuery(
    webSocketQueryOptions("room:update", {
      count: 0,
      members: [],
    }),
  )

  return room.data.members
    .filter((member) => member.username !== user.data?.username)
    .map((member) => <CursorPresence key={member.username} {...member} />)
}
