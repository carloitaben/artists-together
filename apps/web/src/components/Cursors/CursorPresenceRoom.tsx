import { useEffect } from "react"
import { useWebSocketDispatch, useWebSocketPayload } from "~/hooks/ws"
import { useHandle } from "~/services/handle"
import { useUser } from "~/hooks/loaders"
import CursorPresence from "./CursorPresence"

export default function CursorPresenceRoom() {
  const dispatch = useWebSocketDispatch()
  const handle = useHandle()
  const user = useUser()
  const room = useWebSocketPayload("room:update", { count: 0, members: [] })

  useEffect(() => {
    if (!handle) return
    dispatch("room:update", { room: handle.name() })
  }, [dispatch, handle])

  return room.members
    .filter((member) => member.username !== user?.username)
    .map((member) => <CursorPresence key={member.username} {...member} />)
}
