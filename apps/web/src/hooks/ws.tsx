"use client"

import { WebSocket } from "partysocket"
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import {
  ClientEvent,
  ClientEventDataMap,
  ServerEvent,
  ServerEventDataMap,
} from "ws-types"
import { User } from "lucia"
import { usePathname } from "next/navigation"

const eventBuffer = new Map<string, any>()
const listeners = new Map<string, Set<Function>>()
const context = createContext<InstanceType<typeof WebSocket> | undefined>(
  undefined,
)

export const url = process.env.NEXT_PUBLIC_WSS_URL || "ws://localhost:8080"

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
    [event, ws],
  )
}

export function useWebSocketEvent<T extends ServerEvent>(
  event: T,
  callback: (data: ServerEventDataMap[T]) => void,
) {
  const calledBuffer = useRef(false)

  useEffect(() => {
    if (listeners.has(event)) {
      listeners.get(event)?.add(callback)
    } else {
      listeners.set(event, new Set([callback]))
    }

    if (eventBuffer.has(event) && !calledBuffer.current) {
      callback(eventBuffer.get(event))
      calledBuffer.current = true
    }

    return () => {
      listeners.get(event)?.delete(callback)
      listeners.get(event)?.size === 0 && listeners.delete(event)
    }
  }, [callback, event])
}

export function WebSocketProvider({
  children,
  user,
}: {
  user: User | undefined
  children: ReactNode
}) {
  const [ws, setWs] = useState<InstanceType<typeof WebSocket>>()
  const pathname = usePathname()

  useEffect(() => {
    if (!url) return

    // console.log("TODO: authenticate w/ wss using...", { user })

    const ws = new WebSocket(url)

    function onOpen() {
      setWs(ws)
    }

    function onMessage(event: MessageEvent) {
      const [name, data] = JSON.parse(event.data)
      eventBuffer.set(name, data)
      listeners.get(name)?.forEach((callback) => callback(data))
    }

    ws.addEventListener("open", onOpen)
    ws.addEventListener("message", onMessage)

    return () => {
      ws.removeEventListener("open", onOpen)
      ws.removeEventListener("message", onMessage)
      ws.close()
    }
  }, [user])

  useEffect(() => {
    ws?.send(JSON.stringify(["navigate", pathname]))
  }, [pathname, ws])

  return <context.Provider value={ws}>{children}</context.Provider>
}
