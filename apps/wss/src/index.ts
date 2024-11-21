import type { ServerWebSocket } from "bun"
import { SuperHeaders } from "@mjackson/headers"
import type { SessionValidationResult } from "@artists-together/core/auth"
import { validateSessionToken } from "@artists-together/core/auth"
import { unreachable } from "@artists-together/core/utils"
import type { Cursor, ServerEventData } from "@artists-together/core/websocket"
import {
  encodeServerMessage,
  parseClientMessage,
} from "@artists-together/core/websocket"

type WebSocketData = {
  room?: string
  auth: SessionValidationResult
  cursor: Cursor
}

const connections = new Set<ServerWebSocket<WebSocketData>>()

function update(ws: ServerWebSocket<WebSocketData>) {
  connections.delete(ws)
  connections.add(ws)
}

function getRoomState(room: string) {
  return Array.from(connections).reduce<ServerEventData<"room:update">>(
    (state, ws) => {
      if (ws.data.room !== room) return state

      ++state.count

      if (ws.data.auth) {
        state.members.push({
          cursor: ws.data.cursor,
          username: ws.data.auth.user.username,
        })
      }

      return state
    },
    { count: 0, members: [] }
  )
}

const server = Bun.serve<WebSocketData>({
  port: process.env.PORT || 1999,
  async fetch(request, server) {
    const headers = new SuperHeaders(request.headers)
    const token = headers.cookie.get("session") ?? ""
    // const auth = await validateSessionToken(token)

    const upgraded = server.upgrade<WebSocketData>(request, {
      data: {
        // auth,
        auth: {
          session: {
            id: Math.random().toString(),
            expiresAt: new Date(),
            userId: Math.random(),
          },
          user: {
            username: Math.random().toString(),
          },
        },
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
      connections.add(ws)
    },
    close(ws) {
      connections.delete(ws)

      if (!ws.data.room) return

      ws.unsubscribe(ws.data.room)

      server.publish(
        ws.data.room,
        encodeServerMessage("room:update", getRoomState(ws.data.room))
      )
    },
    async message(ws, message) {
      const parsed = parseClientMessage(message)

      if (!parsed.success) {
        console.warn("Received invalid message", {
          error: parsed.error.message,
          message,
        })

        return ws.close(1009, parsed.error.message)
      }

      switch (parsed.data.event) {
        case "room:update":
          // Bail out when trying to join the same room
          if (ws.data.room === parsed.data.payload.room) return

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
          ws.data.room = parsed.data.payload.room
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
            ws.data.cursor = parsed.data.payload
            update(ws)
            server.publish(
              ws.data.room,
              encodeServerMessage("cursor:update", {
                cursor: parsed.data.payload,
                username: ws.data.auth.user.username,
              })
            )
          }
          break
        case "invalidate":
          console.log("TODO: not implemented")
          break
        default:
          unreachable(parsed.data, "Unreachable event")
      }
    },
  },
})
