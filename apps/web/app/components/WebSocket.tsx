import type { PartySocket } from "ws/react"
import { usePartySocket } from "ws/react"
import type { ReactNode } from "react"
import { createContext, useContext } from "react"

const context = createContext<PartySocket | null>(null)

context.displayName = "WebSocketContext"

type Props = {
  children: ReactNode
}

export function useWebSocket() {
  const value = useContext(context)

  if (!value) {
    throw Error("Called WebSocket context outside provider")
  }

  return value
}

export default function WebSocket({ children }: Props) {
  const webSocket = usePartySocket({
    host: "localhost:1999",
    room: "room",
    onOpen() {
      console.log("connected")
    },
    onMessage(event) {
      console.log("message", event.data)
    },
    onClose() {
      console.log("closed")
    },
    onError(error) {
      console.log("error", error)
    },
    async query() {
      console.log("get auth token from user (WIP™)")
      return {
        token: "123",
      }
    },
  })

  return <context.Provider value={webSocket}>{children}</context.Provider>
}
