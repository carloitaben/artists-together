import { redirect } from "@remix-run/node"
import { $path } from "remix-routes"

type Route = {
  label: string
  icon: string
  href: string
  disabled?: true
}

export const routes = [
  {
    label: "Home",
    icon: "home",
    href: $path("/"),
  },
  {
    label: "About",
    icon: "help",
    href: $path("/about"),
  },
  {
    label: "Artists Lounge",
    icon: "diversity",
    href: $path("/lounge"),
    disabled: true,
  },
  {
    label: "Artist Raid Train",
    icon: "train",
    href: $path("/art"),
    disabled: true,
  },
  {
    label: "Calendar",
    icon: "calendar",
    href: $path("/calendar"),
    disabled: true,
  },
] satisfies Route[]

export function guardDisabledRoute() {
  if (import.meta.env.PROD) {
    throw redirect("/404")
  }
}
