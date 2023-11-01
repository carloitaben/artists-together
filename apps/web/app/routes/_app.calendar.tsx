import { guardDisabledRoute } from "~/lib/routes"

export const handle = {
  actions: {
    toggle: () => console.log("toggle"),
  },
  page: {
    name: "Calendar",
  },
}

export async function loader() {
  guardDisabledRoute()
  return null
}

export default function Page() {
  return <main>calendar</main>
}
