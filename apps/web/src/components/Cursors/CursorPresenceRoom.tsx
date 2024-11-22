import { useSuspenseQueries } from "@tanstack/react-query"
import { webSocketQueryOptions } from "~/lib/websocket"
import { authenticateQueryOptions } from "~/services/auth/queries"
import CursorPresence from "./CursorPresence"

export default function CursorPresenceRoom() {
  const [auth, room] = useSuspenseQueries({
    queries: [
      authenticateQueryOptions,
      webSocketQueryOptions("room:update", { count: 0, members: [] }),
    ],
  })

  return room.data.members
    .filter((member) => member.username !== auth.data?.user.username)
    .map((member) => <CursorPresence key={member.username} {...member} />)
}
