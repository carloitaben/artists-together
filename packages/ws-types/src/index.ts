export type Cursor = [x: number, y: number, press: boolean] | null

export type ClientEventDataMap = {
  navigate: string
  cursor: Cursor
}

export type ClientEvent = keyof ClientEventDataMap

export type ServerEventDataMap = {
  "room:newconnection": [id: string, cursor: Cursor]
  "room:newdisconnection": string
  "room:join": (readonly [string, Cursor])[]
  "cursor:update": [id: string, cursor: Cursor]
}

export type ServerEvent = keyof ServerEventDataMap
