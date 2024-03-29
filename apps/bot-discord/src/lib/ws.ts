import type { ClientEvent, ClientEventDataMap, ServerEvent, ServerEventDataMap } from "ws-types"
import { WebSocket } from "ws"

const WSS_URL = process.env.NEXT_PUBLIC_WSS_URL
const url = WSS_URL || process.env.NODE_ENV === "production" ? WSS_URL : "ws://localhost:8080"

const listeners = new Map<string, Set<Function>>()
let ws: WebSocket | null = null

export function connect() {
  return new Promise((resolve) => {
    if (ws) return resolve(ws)

    ws = new WebSocket(String(url))

    ws.on("message", (rawData) => {
      const [name, data] = JSON.parse(rawData.toString())
      listeners.get(name)?.forEach((callback) => callback(data))
    })

    ws.once("open", () => {
      resolve(ws)
    })
  })
}

export function subscribe<T extends ServerEvent>(event: T, callback: (data: ServerEventDataMap[T]) => void) {
  const set = listeners.get(event)

  if (set) {
    set.add(callback)
  } else {
    listeners.set(event, new Set([callback]))
  }

  return () => listeners.get(event)?.delete(callback)
}

export function emit<T extends ClientEvent>(event: T, data: ClientEventDataMap[T]) {
  if (!ws || ws.readyState !== ws.OPEN) return
  ws.send(JSON.stringify([event, data]))
}
