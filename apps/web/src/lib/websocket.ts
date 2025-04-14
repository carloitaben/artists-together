"use client"

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
} from "@tanstack/react-query"
import { WebSocket as ReconnectingWebSocket } from "partysocket"
import { useEffect } from "react"
import * as v from "valibot"
import { useNavigationMatch } from "./navigation/client"
import { useHints } from "./promises"
import { getQueryClient } from "~/features/query/shared"
import { userQueryOptions } from "~/features/auth/shared"

const queue = new Map<ClientEvent, string>()

export function webSocketQueryOptions<T extends ServerEvent>(
  event: T,
  initialData: ServerEventOutput<T>,
) {
  return queryOptions({
    queryFn: async () => {
      throw new Error("Unexpectedly run webSocket queryFn")
    },
    initialData,
    queryKey: [`ws:${event}`],
    staleTime: Infinity,
  })
}

export const webSocket = new ReconnectingWebSocket(
  async () => {
    const queryClient = getQueryClient()
    const user = await queryClient.ensureQueryData(userQueryOptions)
    const url = new URL(
      process.env.NEXT_PUBLIC_WSS_URL || "ws://localhost:1999",
    )

    if (user) {
      url.searchParams.set("user", user.username)
    }

    return url.href
  },
  process.env.NEXT_PUBLIC_WSS_URL ? "https" : "http",
  {
    startClosed: true,
  },
)

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

export function WebSocket() {
  const queryClient = useQueryClient()
  const match = useNavigationMatch()
  const hints = useHints()

  useEffect(() => {
    if (hints.saveData || hints.isBot) return

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
        if (process.env.NODE_ENV !== "development") return
        throw new v.ValiError(parsed.issues)
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

    webSocket.reconnect()
    webSocket.addEventListener("open", onOpen)
    webSocket.addEventListener("message", onMessage)

    return () => {
      webSocket.close()
      webSocket.removeEventListener("open", onOpen)
      webSocket.removeEventListener("message", onMessage)
    }
  }, [hints.isBot, hints.saveData, queryClient])

  useEffect(() => {
    sendWebSocketMessage("room:update", {
      room: match?.link.href.toString() || "404",
    })
  }, [match])

  return null
}
