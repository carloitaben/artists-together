import type { IconName } from "~/lib/icons"

export type Route = {
  label: string
  icon: IconName
  href: string
  end: boolean
  disabled?: boolean
  search?: boolean
  actions: any[]
}

export const routes: Route[] = [
  {
    label: "Home",
    icon: "Home",
    href: "/",
    end: true,
    actions: [],
  },
  {
    label: "About",
    icon: "Help",
    href: "/about",
    end: true,
    actions: ["foo"],
  },
  {
    label: "Artists Lounge",
    icon: "Diversity",
    href: "/lounge",
    disabled: true,
    end: true,
    actions: [],
  },
  {
    label: "Artist Raid Train",
    icon: "Train",
    href: "/art",
    disabled: true,
    end: true,
    search: true,
    actions: ["foo"],
  },
  {
    label: "Calendar",
    icon: "Calendar",
    href: "/calendar",
    end: false,
    actions: [],
  },
]
