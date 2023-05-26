import { WebSocket, WebSocketServer } from "ws"
import { ClientEvent, ClientEventDataMap, Cursor, ServerEvent, ServerEventDataMap } from "ws-types"
import { nanoid } from "nanoid"

type ExtendedWebSocket = WebSocket & {
  id: string
  room: string | null
  cursor: Cursor | null
  isAlive: boolean
}

function send<T extends ServerEvent>(ws: ExtendedWebSocket, event: T, data: ServerEventDataMap[T]) {
  if (ws.readyState === ws.OPEN) ws.send(JSON.stringify([event, data]))
}

const rooms = new Map<string, Set<ExtendedWebSocket>>()
const wss = new WebSocketServer<ExtendedWebSocket>({ port: 8080 })

const pingInterval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) return ws.terminate()
    ws.isAlive = false
    ws.ping()
  })
}, 30000)

wss.on("connection", (ws) => {
  ws.id = nanoid()
  ws.isAlive = true
  ws.room = null
  ws.cursor = null

  ws.on("error", console.error)

  ws.on("pong", () => {
    ws.isAlive = true
  })

  ws.on("close", () => {
    if (ws.room) {
      const room = rooms.get(ws.room)
      room?.delete(ws)
      room?.forEach((client) => {
        if (client === ws) return
        send(client, "room:newdisconnection", ws.id)
      })
    }
  })

  ws.on("message", (rawData) => {
    const [name, _data] = JSON.parse(rawData.toString())

    switch (name as ClientEvent) {
      case "navigate":
        {
          const data = _data as ClientEventDataMap["navigate"] // TODO: zod

          if (ws.room) {
            const room = rooms.get(ws.room)
            room?.delete(ws)
            room?.forEach((client) => {
              if (client === ws) return
              send(client, "room:newdisconnection", ws.id)
            })
          }

          ws.room = data

          if (rooms.has(data)) {
            const room = rooms.get(data)
            const roomState = Array.from(room?.values() || []).map((client) => [client.id, client.cursor] as const)
            send(ws, "room:join", roomState)
            room?.add(ws)
            room?.forEach((client) => {
              if (client === ws) return
              send(client, "room:newconnection", [ws.id, ws.cursor])
            })
          } else {
            rooms.set(data, new Set([ws]))
            send(ws, "room:join", [])
          }
        }
        break
      case "cursor": {
        const data = _data as ClientEventDataMap["cursor"] // TODO: zod

        ws.cursor = data

        if (!ws.room) {
          // No-op, client needs to connect first
          console.log(ws.id, "needs to connect to a room")
          return
        }

        const room = rooms.get(ws.room)

        room?.forEach((client) => {
          if (client === ws) return
          send(client, "cursor:update", [ws.id, data])
        })
        break
      }
    }
  })
})

wss.on("close", () => {
  clearInterval(pingInterval)
})
