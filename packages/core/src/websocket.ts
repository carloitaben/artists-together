import type { SafeParseReturnType } from "zod"
import { z } from "zod"
import type { ValueOf } from "./types"
import { AnyJSONString } from "./schemas"

export const CursorState = z.enum(["idle", "hover", "drag"])

export type CursorState = z.infer<typeof CursorState>

export const Cursor = z
  .object({
    x: z.number().min(0).max(1),
    y: z.number().min(0).max(1),
    target: z.string(),
    state: CursorState,
  })
  .nullable()

export type Cursor = z.infer<typeof Cursor>

export const Invalidation = z.object({
  exact: z.boolean(),
  queryKey: z.unknown().array(),
})

const events = {
  /**
   * Events sent from the client to the server
   */
  client: {
    /**
     * Tells other clients to invalidate an array of query keys
     */
    invalidate: Invalidation.array(),
    /**
     * Switches to a new room
     */
    "room:update": z.object({
      room: z.string(),
    }),
    /**
     * Sends the current cursor state
     */
    "cursor:update": Cursor,
  },
  /**
   * Events sent from the server to the client
   */
  server: {
    /**
     * Tells other clients to invalidate an array of query keys
     */
    invalidate: Invalidation.array(),
    /**
     * Sends the current state of the room
     */
    "room:update": z.object({
      count: z.number().int().nonnegative(),
      members: z.array(
        z.object({
          cursor: Cursor,
          username: z.string(),
        }),
      ),
    }),
    /**
     * Sends the data for a new connection
     */
    "cursor:update": z.object({
      cursor: Cursor,
      username: z.string(),
    }),
  },
}

type Events = typeof events

function event(kind: keyof Events) {
  return z.string().transform((string, context) => {
    if (string in events[kind]) {
      return string as keyof (typeof events)[typeof kind]
    }

    context.addIssue({
      code: "custom",
      message: `Invalid ${kind} event`,
    })

    return z.NEVER
  })
}

const ClientEvent = event("client")
const ServerEvent = event("server")

export type ClientEvent = z.infer<typeof ClientEvent>
export type ServerEvent = z.infer<typeof ServerEvent>

export type ClientEventData<T extends ClientEvent> = z.output<
  Events["client"][T]
>
export type ServerEventData<T extends ServerEvent> = z.output<
  Events["server"][T]
>

/**
 * Creates a WebSocket message for sending to the server from the client.
 */
export function encodeClientMessage<T extends ClientEvent>(
  event: T,
  data: ClientEventData<T>,
) {
  const clientEvent = ClientEvent.parse(event)
  const clientEventData = events.client[clientEvent].parse(data)
  return JSON.stringify([event, clientEventData])
}

/**
 * Creates a WebSocket message for sending from the client to the server.
 */
export function encodeServerMessage<T extends ServerEvent>(
  event: T,
  data: ServerEventData<T>,
) {
  const serverEvent = ServerEvent.parse(event)
  const serverEventData = events.server[serverEvent].parse(data)
  return JSON.stringify([event, serverEventData])
}

const EncodedClientMessage = AnyJSONString.pipe(
  z.tuple([ClientEvent, z.unknown()]).transform(([event, json], context) => {
    const payload = events.client[event].safeParse(json)

    if (!payload.success) {
      context.addIssue({
        code: "custom",
        message: payload.error.message,
      })

      return z.NEVER
    }

    return {
      event,
      payload: payload.data,
    }
  }),
)

const EncodedServerMessage = AnyJSONString.pipe(
  z.tuple([ServerEvent, z.unknown()]).transform(([event, json], context) => {
    const payload = events.server[event].safeParse(json)

    if (!payload.success) {
      context.addIssue({
        code: "custom",
        message: payload.error.message,
      })

      return z.NEVER
    }

    return {
      event,
      payload: payload.data,
    }
  }),
)

/**
 * Parses a WebSocket message received from the client.
 */
export function parseClientMessage(
  message: string | Buffer,
): SafeParseReturnType<
  string | Buffer,
  ValueOf<{
    [K in ClientEvent]: {
      event: K
      payload: ClientEventData<K>
    }
  }>
> {
  return EncodedClientMessage.safeParse(
    typeof message === "string" ? message : message.toString(),
  ) as any
}

/**
 * Parses a WebSocket message received from the server.
 */
export function parseServerMessage(
  message: string | Buffer,
): SafeParseReturnType<
  string | Buffer,
  ValueOf<{
    [K in ServerEvent]: {
      event: K
      payload: ServerEventData<K>
    }
  }>
> {
  return EncodedServerMessage.safeParse(
    typeof message === "string" ? message : message.toString(),
  ) as any
}
