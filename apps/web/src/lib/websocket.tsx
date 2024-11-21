import type {
  ClientEvent,
  ClientEventData,
  ServerEvent,
  ServerEventData,
} from "@artists-together/core/websocket"
import {
  encodeClientMessage,
  parseServerMessage,
} from "@artists-together/core/websocket"
import {
  queryOptions,
  useQueryClient,
  useSuspenseQueries,
} from "@tanstack/react-query"
import { useLocation } from "@tanstack/react-router"
import type { ReactNode } from "react"
import { useCallback, useEffect, useState } from "react"
import { PartySocket } from "partysocket"
import { authenticateQueryOptions } from "~/services/auth/queries"
import { hintsQueryOptions } from "~/services/hints/queries"
import { createContextFactory } from "~/lib/react"

const [WebSocketContextProvider, useWebSocketContext] =
  createContextFactory<PartySocket | null>("WebSocketContext", null)

const queue = new Map<ClientEvent, string>()

export function webSocketQueryOptions<T extends ServerEvent>(
  event: T,
  initialData: ServerEventData<T>,
) {
  return queryOptions({
    initialData,
    queryKey: [`ws:${event}`],
    staleTime: Infinity,
  })
}

export function useWebSocket() {
  const webSocket = useWebSocketContext()

  const send = useCallback(
    function send<T extends ClientEvent>(event: T, data: ClientEventData<T>) {
      const message = encodeClientMessage(event, data)

      if (webSocket && webSocket.readyState === webSocket.OPEN) {
        webSocket.send(message)
      } else {
        queue.set(event, message)
      }
    },
    [webSocket],
  )

  return {
    instance: webSocket,
    send,
  }
}

function NotifyLocationChange() {
  const webSocket = useWebSocket()
  const room = useLocation({ select: (state) => state.pathname })

  useEffect(() => {
    webSocket.send("room:update", { room })
  }, [room, webSocket])

  return null
}

export function WebSocket({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [webSocket, setWebSocket] = useState<PartySocket | null>(null)
  const [auth, hints] = useSuspenseQueries({
    queries: [authenticateQueryOptions, hintsQueryOptions],
  })

  useEffect(() => {
    if (hints.data.saveData || hints.data.isBot) return

    const webSocket = new PartySocket({
      host: process.env.WSS_URL || "ws://localhost:1999",
      debug: false,
      startClosed: false,
    })

    function onOpen() {
      queue.forEach((message, event) => {
        if (webSocket.readyState === webSocket.OPEN) {
          webSocket.send(message)
          queue.delete(event)
        }
      })
    }

    function onMessage(message: MessageEvent) {
      const parsed = parseServerMessage(message.data)

      if (!parsed.success) {
        if (import.meta.env.DEV) {
          console.error(
            `Error while unpacking WebSocket message: ${parsed.error}`,
          )
        }

        return
      }

      if (parsed.data.event === "invalidate") {
        return parsed.data.payload.forEach((invalidation) => {
          queryClient.invalidateQueries(invalidation)
        })
      }

      queryClient.setQueryData(
        [`ws:${parsed.data.event}`],
        () => parsed.data.payload,
      )
    }

    webSocket.addEventListener("open", onOpen)
    webSocket.addEventListener("message", onMessage)
    setWebSocket(webSocket)

    return () => {
      webSocket.close()
      webSocket.removeEventListener("open", onOpen)
      webSocket.removeEventListener("message", onMessage)
      setWebSocket(null)
    }
  }, [hints.data.isBot, hints.data.saveData, queryClient])

  return (
    <WebSocketContextProvider value={webSocket}>
      <NotifyLocationChange />
      {children}
    </WebSocketContextProvider>
  )
}
