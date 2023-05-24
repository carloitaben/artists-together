"use client"

import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export type Cursor = [x: number, y: number, press: boolean]

export type ClientEventDataMap = {
  navigate: string
  cursor: Cursor
}

export type ClientEvent = keyof ClientEventDataMap

export type ServerEventDataMap = {
  "room:newconnection": [id: string, cursor: Cursor | null]
  "room:newdisconnection": string
  "room:join": (readonly [string, Cursor | null])[]
  "cursor:update": [id: string, cursor: Cursor]
}

export type ServerEvent = keyof ServerEventDataMap

const listeners = new Map<string, Set<(...args: any[]) => void>>()
const context = createContext<WebSocket | undefined>(undefined)

function useWebSocket() {
  return useContext(context)
}

export function useWebSocketEmitter<T extends ClientEvent>(event: T) {
  const ws = useWebSocket()

  return useCallback(
    (data: ClientEventDataMap[T]) => {
      ws?.send(JSON.stringify([event, data]))
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
