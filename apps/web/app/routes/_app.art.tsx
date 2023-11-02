import type { MetaFunction } from "@remix-run/react"
import { guardDisabledRoute } from "~/lib/routes"

export const meta: MetaFunction = () => [
  {
    title: "Artist Raid Train – Artists Together",
  },
]

export const handle = {
  actions: {
    help: () => console.log("help"),
  },
  page: {
    name: "Artist Raid Train",
  },
}

export async function loader() {
  guardDisabledRoute()
  return null
}

export default function Page() {
  return <main>art</main>
}
