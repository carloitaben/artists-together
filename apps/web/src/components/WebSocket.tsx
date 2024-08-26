"use client"

import type { ServerEvent, ServerEventData } from "@artists-together/core/ws"
import { unpackServerMessage } from "@artists-together/core/ws"
import type { ReactNode } from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { WebSocket as WebSocketInstance } from "partysocket"
import { useHints } from "~/lib/headers/client"

const WebsocketContext = createContext<WebSocketInstance | null>(null)

WebsocketContext.displayName = "WebsocketContext"

export function useWebSocket() {
  return useContext(WebsocketContext)
}

const webSocketLatestPayloadMap = new Map<ServerEvent, ServerEventData<any>>()

export function getLatestPayload<Event extends ServerEvent>(
  event: Event,
): ServerEventData<Event> | undefined {
  return webSocketLatestPayloadMap.get(event) ?? undefined
}

const webSocketSubscriptionsMap = new Map<
  ServerEvent,
  Set<(data: any) => void>
>()

export type SubscribeCallback<Event extends ServerEvent> = (
  data: ServerEventData<Event>,
) => void

export function subscribe<Event extends ServerEvent>(
  event: Event,
  callback: SubscribeCallback<Event>,
) {
  const set = webSocketSubscriptionsMap.get(event) || new Set()
  webSocketSubscriptionsMap.set(event, set.add(callback))

  return () => {
    set.delete(callback)
    webSocketSubscriptionsMap.set(event, set)
  }
}

type Props = {
  children: ReactNode
}

export default function WebSocket({ children }: Props) {
  const [ws, setWs] = useState<WebSocketInstance | null>(null)
  const hints = useHints()

  useEffect(() => {
    if (hints?.saveData || hints?.isBot) return

    const webSocketInstance = new WebSocketInstance(
      "ws://localhost:1999",
      undefined,
      {
        debug: false,
        startClosed: false,
      },
    )

    function onMessage(message: MessageEvent) {
      const result = unpackServerMessage(message.data)

      if (!result.success) return

      webSocketLatestPayloadMap.set(result.data.event, result.data.payload)
      webSocketSubscriptionsMap.get(result.data.event)?.forEach((callback) => {
        callback(result.data.payload)
      })
    }

    webSocketInstance.addEventListener("message", onMessage)
    setWs(webSocketInstance)

    return () => {
      webSocketInstance.close()
      webSocketInstance.removeEventListener("message", onMessage)
      setWs(null)
    }
  }, [hints?.isBot, hints?.saveData])

  return (
    <WebsocketContext.Provider value={ws}>{children}</WebsocketContext.Provider>
  )
}
