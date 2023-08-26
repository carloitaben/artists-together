import { map } from "nanostores"

type Cursor = {
  x: number
  y: number
}

export const $cursor = map<Cursor>({
  x: 0,
  y: 0,
})
