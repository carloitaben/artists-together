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
  focusManager,
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { useLocation } from "@tanstack/react-router"
import { useEffect } from "react"
import { PartySocket } from "partysocket"
import { hintsQueryOptions } from "~/services/hints/shared"

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

export const webSocket = new PartySocket({
  host: process.env.WSS_URL || "ws://localhost:1999",
  debug: import.meta.env.DEV,
  startClosed: true,
})

export function sendWebSocketMessage<T extends ClientEvent>(
  event: T,
  data: ClientEventOutput<T>,
) {
  const focused = focusManager.isFocused()

  if (!focused) return

  const message = encodeClientMessage(event, data)

  if (webSocket.readyState === webSocket.OPEN) {
    webSocket.send(message)
  } else {
    queue.set(event, message)
  }
}

export function useWebSocket() {
  const queryClient = useQueryClient()
  const hints = useSuspenseQuery(hintsQueryOptions)
  const room = useLocation({ select: (state) => state.pathname })

  useEffect(() => {
    if (hints.data.saveData || hints.data.isBot) return

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

    return () => {
      webSocket.close()
      webSocket.removeEventListener("open", onOpen)
      webSocket.removeEventListener("message", onMessage)
    }
  }, [hints.data.isBot, hints.data.saveData, queryClient])

  useEffect(() => {
    sendWebSocketMessage("room:update", { room })
  }, [room])
}
