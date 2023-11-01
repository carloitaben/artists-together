import { guardDisabledRoute } from "~/lib/routes"

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
