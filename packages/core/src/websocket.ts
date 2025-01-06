import * as v from "valibot"
import { AnyJSONString } from "./schemas"

export const CursorState = v.picklist(["idle", "hover", "drag"])

export type CursorState = v.InferOutput<typeof CursorState>

export const Cursor = v.nullable(
  v.object({
    x: v.pipe(v.number(), v.minValue(0), v.maxValue(1)),
    y: v.pipe(v.number(), v.minValue(0), v.maxValue(1)),
    target: v.string(),
    state: CursorState,
  }),
)

export type Cursor = v.InferOutput<typeof Cursor>

/**
 * An array of tuples representing the delta of the message, and the message itself.
 */
export const CursorUpdates = v.array(v.tuple([v.number(), Cursor]))

export type CursorUpdates = v.InferOutput<typeof CursorUpdates>

export const Invalidation = v.object({
  exact: v.boolean(),
  queryKey: v.array(v.string()),
})

export type Invalidation = v.InferOutput<typeof Invalidation>

const events = {
  /**
   * Events sent from the client to the server
   */
  client: {
    /**
     * Tells other clients to invalidate an array of query keys
     */
    invalidate: v.array(Invalidation),
    /**
     * Switches to a new room
     */
    "room:update": v.object({
      room: v.string(),
    }),
    /**
     * Sends the current cursor state
     */
    "cursor:update": CursorUpdates,
  },
  /**
   * Events sent from the server to the client
   */
  server: {
    /**
     * Tells other clients to invalidate an array of query keys
     */
    invalidate: v.array(Invalidation),
    /**
     * Sends the current state of the room
     */
    "room:update": v.object({
      count: v.pipe(v.number(), v.integer(), v.minValue(0)),
      members: v.array(
        v.object({
          cursor: Cursor,
          username: v.string(),
        }),
      ),
    }),
    /**
     * Sends the data for a new connection
     */
    "cursor:update": v.object({
      cursor: CursorUpdates,
      username: v.string(),
    }),
  },
}

type Events = typeof events

export const ClientEvent = v.custom<keyof Events["client"]>(
  (value) => typeof value === "string" && value in events.client,
)

export type ClientEvent = v.InferOutput<typeof ClientEvent>

export const ServerEvent = v.custom<keyof Events["server"]>(
  (value) => typeof value === "string" && value in events.server,
)

export type ServerEvent = v.InferOutput<typeof ServerEvent>

export type ClientEventInput<T extends ClientEvent> = v.InferInput<
  Events["client"][T]
>

export type ServerEventInput<T extends keyof Events["server"]> = v.InferInput<
  Events["server"][T]
>

export type ClientEventOutput<T extends ClientEvent> = v.InferOutput<
  Events["client"][T]
>

export type ServerEventOutput<T extends keyof Events["server"]> = v.InferOutput<
  Events["server"][T]
>

export function encodeClientMessage<T extends ClientEvent>(
  event: T,
  data: ClientEventOutput<T>,
) {
  const schema = events.client[event]
  const parsed = v.parse(schema, data)
  return JSON.stringify([event, parsed])
}

export function encodeServerMessage<T extends keyof Events["server"]>(
  event: T,
  data: ServerEventOutput<T>,
) {
  const schema = events.server[event]
  const parsed = v.parse(schema, data)
  return JSON.stringify([event, parsed])
}

export const safeParseClientMessage = v.safeParser(
  v.pipe(
    AnyJSONString,
    v.tuple([ClientEvent, v.unknown()]),
    v.rawTransform((context) => {
      const schema = events.client[context.dataset.value[0]]
      const parsed = v.safeParse(schema, context.dataset.value[1])

      if (!parsed.success) {
        context.addIssue({
          message: "Invalid Websocket client message",
          input: parsed.output,
        })

        return context.NEVER
      }

      return {
        event: context.dataset.value[0],
        data: parsed.output,
      } as {
        [K in ClientEvent]: {
          event: K
          data: ClientEventOutput<K>
        }
      }[ClientEvent]
    }),
  ),
)

export const safeParseServerMessage = v.safeParser(
  v.pipe(
    AnyJSONString,
    v.tuple([ServerEvent, v.unknown()]),
    v.rawTransform((context) => {
      const schema = events.server[context.dataset.value[0]]
      const parsed = v.safeParse(schema, context.dataset.value[1])

      if (!parsed.success) {
        context.addIssue({
          message: "Invalid Websocket server message",
          input: parsed.output,
        })

        return context.NEVER
      }

      return {
        event: context.dataset.value[0],
        data: parsed.output,
      } as {
        [K in ServerEvent]: {
          event: K
          data: ServerEventOutput<K>
        }
      }[ServerEvent]
    }),
  ),
)
