import type { MetaFunction } from "@remix-run/react"
import { guardDisabledRoute } from "~/server/lib.server"

export const meta: MetaFunction = () => [
  {
    title: "Artists Lounge – Artists Together",
  },
]

export const handle = {
  actions: {
    search: () => console.log("search"),
    filter: () => console.log("filter"),
  },
  page: {
    name: "Artists Lounge",
  },
}

export async function loader() {
  guardDisabledRoute()
  return null
}

export default function Page() {
  return <main>lounge</main>
}
