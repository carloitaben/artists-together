import { guardDisabledRoute } from "~/lib/routes"

export const handle = {
  actions: {
    help: () => console.log("help"),
  },
}

export async function loader() {
  guardDisabledRoute()
  return null
}

export default function Page() {
  return <main>art</main>
}
