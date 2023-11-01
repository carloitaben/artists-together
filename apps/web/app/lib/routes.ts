import { $path } from "remix-routes"

type Route = {
  label: string
  href: string
  disabled?: true
}

export const routes = [
  {
    label: "Home",
    href: $path("/"),
  },
  {
    label: "About",
    href: $path("/about"),
  },
  {
    label: "Artists Lounge",
    href: $path("/lounge"),
  },
  {
    label: "Artist Raid Train",
    href: $path("/art"),
  },
  {
    label: "Calendar",
    href: $path("/calendar"),
  },
] satisfies Route[]


export function guardDisabledRoute() {
  if (import.meta.env.DEV) return

  throw new Response(null, {
    status: 404,
    statusText: "Not Found",
  })
}
