import type { IconName } from "~/lib/types/icons"

export type Route = {
  label: string
  icon: IconName
  href: `/${string}`
  disabled?: boolean
}

export const routes: Route[] = [
  {
    label: "Home",
    icon: "home",
    href: "/",
    // disabled: true,
  },
  {
    label: "About",
    icon: "help",
    href: "/about",
  },
  {
    label: "Artists Lounge",
    icon: "diversity",
    href: "/lounge",
    // disabled: true,
  },
  {
    label: "Artist Raid Train",
    icon: "train",
    href: "/art",
    // disabled: true,
  },
  {
    label: "Calendar",
    icon: "calendar",
    href: "/calendar",
    // disabled: true,
  },
]
