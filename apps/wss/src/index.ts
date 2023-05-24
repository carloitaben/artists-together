import { WebSocket, WebSocketServer } from "ws"
import { nanoid } from "nanoid"

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

function extendWebSocket(ws: Omit<WebSocket, "emit">) {
  return Object.assign(ws, {
    id: nanoid(),
    room: null,
    cursor: null,
  } as {
    id: string
    room: string | null
    cursor: Cursor | null
  })
}

type ExtendedWebSocket = ReturnType<typeof extendWebSocket>

function send<T extends ServerEvent>(ws: ExtendedWebSocket, event: T, data: ServerEventDataMap[T]) {
  return ws.send(JSON.stringify([event, data]))
}

const rooms = new Map<string, Set<ExtendedWebSocket>>()
const wss = new WebSocketServer({ port: 8080 })

wss.on("connection", (webSocket) => {
  const ws = extendWebSocket(webSocket)

  ws.on("error", console.error)

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

    console.log(ws.id, name, _data)

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
              console.log("sending to client", client.id, "data of new cursor", ws.id)
              send(client, "room:newconnection", [ws.id, ws.cursor])
            })
          } else {
            rooms.set(data, new Set([ws]))
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
