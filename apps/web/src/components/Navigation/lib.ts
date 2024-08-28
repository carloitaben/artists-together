import type { IconName } from "~/lib/icons"

export type Route = {
  label: string
  icon: IconName
  href: string
  end?: boolean
  disabled?: boolean
}

export const routes = [
  {
    label: "Home",
    icon: "Home",
    href: "/",
  },
  {
    label: "About",
    icon: "Help",
    href: "/about",
  },
  {
    label: "Artists Lounge",
    icon: "Diversity",
    href: "/lounge",
    disabled: true,
  },
  {
    label: "Artist Raid Train",
    icon: "Train",
    href: "/art",
    disabled: true,
  },
  {
    label: "Calendar",
    icon: "Calendar",
    href: "/calendar",
    end: false,
  },
] satisfies Route[]
