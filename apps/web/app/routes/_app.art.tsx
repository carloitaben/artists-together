import { guardDisabledRoute } from "~/lib/routes"

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
