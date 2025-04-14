import "dotenv-mono/load"
import type { ServerWebSocket } from "bun"
import type {
  Cursor,
  ServerEventOutput,
} from "@artists-together/core/websocket"
import {
  encodeServerMessage,
  safeParseClientMessage,
} from "@artists-together/core/websocket"

type WebSocketData = {
  uuid: string
  room?: string
  auth: boolean
  cursor: Cursor
}

const connections = new Map<string, ServerWebSocket<WebSocketData>>()

function update(ws: ServerWebSocket<WebSocketData>) {
  connections.set(ws.data.uuid, ws)
}

function getRoomState(room: string) {
  return connections.values().reduce<ServerEventOutput<"room:update">>(
    (state, ws) => {
      if (ws.data.room !== room) return state

      ++state.count

      if (ws.data.auth) {
        state.members.push({
          cursor: ws.data.cursor,
          username: ws.data.uuid,
        })
      }

      return state
    },
    { count: 0, members: [] }
  )
}

const server = Bun.serve<WebSocketData, {}>({
  port: process.env.PORT || 1999,
  async fetch(request, server) {
    const url = new URL(request.url)
    const user = url.searchParams.get("user")

    console.log("[INFO] found auth for cookie", {
      uuid: user || Math.random().toString(),
    })

    const upgraded = server.upgrade<WebSocketData>(request, {
      data: {
        auth: Boolean(user),
        uuid: user || Math.random().toString(),
        cursor: null,
      },
    })

    if (!upgraded) {
      return new Response("Upgrade failed", {
        status: 500,
      })
    }
  },
  websocket: {
    open(ws) {
      connections.set(ws.data.uuid, ws)
    },
    close(ws) {
      connections.delete(ws.data.uuid)

      if (!ws.data.room) return

      ws.unsubscribe(ws.data.room)

      server.publish(
        ws.data.room,
        encodeServerMessage("room:update", getRoomState(ws.data.room))
      )
    },
    async message(ws, message) {
      const parsed = safeParseClientMessage(message)

      if (!parsed.success) {
        console.warn("Received invalid message", parsed)
        return ws.close(1009, "Invalid message")
      }

      switch (parsed.output.event) {
        case "room:update":
          // Bail out when trying to join the same room
          if (ws.data.room === parsed.output.data.room) return

          // Leave the previous room
          if (ws.data.room) {
            const previous = ws.data.room
            delete ws.data.room
            ws.unsubscribe(previous)
            update(ws)

            server.publish(
              previous,
              encodeServerMessage("room:update", getRoomState(previous))
            )
          }

          // Join the new room
          ws.data.room = parsed.output.data.room
          ws.subscribe(ws.data.room)
          update(ws)

          ws.send(
            encodeServerMessage("room:update", getRoomState(ws.data.room))
          )

          server.publish(
            ws.data.room,
            encodeServerMessage("room:update", getRoomState(ws.data.room))
          )
          break
        case "cursor:update":
          if (ws.data.room && ws.data.auth) {
            ws.data.cursor =
              parsed.output.data[parsed.output.data.length - 1]?.[1] || null

            update(ws)
            server.publish(
              ws.data.room,
              encodeServerMessage("cursor:update", {
                cursor: parsed.output.data,
                username: ws.data.uuid,
              })
            )
          }
          break
        case "invalidate":
          console.warn("TODO: not implemented")
          break
        default:
          console.warn("Received unsupported message", parsed)
          return ws.close(1009, "Unsupported message")
      }
    },
  },
})
