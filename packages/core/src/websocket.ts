import type { SafeParseReturnType } from "zod"
import { z } from "zod"
import type { ValueOf } from "./types"

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

export const Events = z.object({
  /**
   * Events sent from the client to the server
   */
  client: z.object({
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
  }),
  /**
   * Events sent from the server to the client
   */
  server: z.object({
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
  }),
})

export type Events = z.infer<typeof Events>

const StringToJSON = z.string().transform((string, context) => {
  try {
    return JSON.parse(string)
  } catch (error) {
    context.addIssue({
      code: "custom",
      message: "Invalid JSON",
    })

    return z.NEVER
  }
})

const ClientEvent = Events.shape.client.keyof()
const ServerEvent = Events.shape.server.keyof()

export type ClientEvent = z.infer<typeof ClientEvent>
export type ServerEvent = z.infer<typeof ServerEvent>

export type ClientEventData<T extends ClientEvent> = Events["client"][T]
export type ServerEventData<T extends ServerEvent> = Events["server"][T]

const ClientMesageTuple = StringToJSON.pipe(
  z.tuple([ClientEvent, z.unknown()]).transform(([event, json]) => ({
    event,
    payload: Events.shape.client.shape[event].parse(json),
  })),
)

const ServerMesageTuple = StringToJSON.pipe(
  z.tuple([ServerEvent, z.unknown()]).transform(([event, json]) => ({
    event,
    payload: Events.shape.server.shape[event].parse(json),
  })),
)

export function packClientMessage<T extends ClientEvent>(
  event: T,
  data: ClientEventData<T>,
) {
  const clientEvent = ClientEvent.parse(event)
  return JSON.stringify([
    event,
    Events.shape.client.shape[clientEvent].parse(data),
  ])
}

export function packServerMessage<T extends ServerEvent>(
  event: T,
  data: ServerEventData<T>,
) {
  const serverEvent = ServerEvent.parse(event)
  return JSON.stringify([
    event,
    Events.shape.server.shape[serverEvent].parse(data),
  ])
}

export function unpackClientMessage(
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
  return ClientMesageTuple.safeParse(
    typeof message === "string" ? message : message.toString(),
  ) as any
}

export function unpackServerMessage(
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
  return ServerMesageTuple.safeParse(
    typeof message === "string" ? message : message.toString(),
  ) as any
}
