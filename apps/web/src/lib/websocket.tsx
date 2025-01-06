import type {
  ClientEvent,
  ClientEventOutput,
  ServerEvent,
  ServerEventOutput,
} from "@artists-together/core/websocket"
import {
  encodeClientMessage,
  safeParseServerMessage,
} from "@artists-together/core/websocket"
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { useLocation } from "@tanstack/react-router"
import type { ReactNode } from "react"
import { useCallback, useEffect, useState } from "react"
import { PartySocket } from "partysocket"
import { hintsQueryOptions } from "~/services/hints/queries"
import { createContextFactory } from "~/lib/react"

const [WebSocketContextProvider, useWebSocketContext] =
  createContextFactory<PartySocket | null>("WebSocketContext", null)

const queue = new Map<ClientEvent, string>()

export function webSocketQueryOptions<T extends ServerEvent>(
  event: T,
  initialData: ServerEventOutput<T>,
) {
  return queryOptions({
    initialData,
    queryKey: [`ws:${event}`],
  })
}

export function useWebSocket() {
  const webSocket = useWebSocketContext()

  const send = useCallback(
    function send<T extends ClientEvent>(event: T, data: ClientEventOutput<T>) {
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
  const [webSocket, setWebSocket] = useState<PartySocket | null>(null)
  const queryClient = useQueryClient()
  const hints = useSuspenseQuery(hintsQueryOptions)

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
      const parsed = safeParseServerMessage(message.data)

      if (!parsed.success) {
        if (import.meta.env.DEV) {
          console.error(parsed)
        }

        return
      }

      if (parsed.output.event === "invalidate") {
        return parsed.output.data.forEach((invalidation) => {
          queryClient.invalidateQueries(invalidation)
        })
      }

      queryClient.setQueryData(
        [`ws:${parsed.output.event}`],
        () => parsed.output.data,
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
