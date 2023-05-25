"use client"

import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react"
import { ClientEvent, ClientEventDataMap, ServerEvent, ServerEventDataMap } from "ws-types"
import { usePathname } from "next/navigation"

const listeners = new Map<string, Set<Function>>()
const context = createContext<WebSocket | undefined>(undefined)

function useWebSocket() {
  return useContext(context)
}

export function useWebSocketEmitter<T extends ClientEvent>(event: T) {
  const ws = useWebSocket()

  return useCallback(
    (data: ClientEventDataMap[T]) => {
      if (!ws || ws.readyState !== ws.OPEN) return
      ws.send(JSON.stringify([event, data]))
    },
    [event, ws]
  )
}

export function useWebSocketEvent<T extends ServerEvent>(event: T, callback: (data: ServerEventDataMap[T]) => void) {
  useEffect(() => {
    if (listeners.has(event)) {
      listeners.get(event)?.add(callback)
    } else {
      listeners.set(event, new Set([callback]))
    }

    return () => {
      listeners.get(event)?.delete(callback)
      listeners.get(event)?.size === 0 && listeners.delete(event)
    }
  }, [callback, event])
}

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [ws, setWs] = useState<WebSocket>()
  const pathname = usePathname()

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080")

    function onOpen() {
      setWs(ws)
    }

    function onMessage(event: MessageEvent) {
      const [name, data] = JSON.parse(event.data)
      listeners.get(name)?.forEach((callback) => callback(data))
    }

    ws.addEventListener("open", onOpen)
    ws.addEventListener("message", onMessage)

    return () => {
      ws.removeEventListener("open", onOpen)
      ws.removeEventListener("message", onMessage)
      ws.close()
    }
  }, [])

  useEffect(() => {
    ws?.send(JSON.stringify(["navigate", pathname]))
  }, [pathname, ws])

  return <context.Provider value={ws}>{children}</context.Provider>
}
