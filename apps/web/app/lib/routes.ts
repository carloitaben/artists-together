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
