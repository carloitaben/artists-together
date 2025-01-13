import { linkOptions } from "@tanstack/react-router"
import type { IconName } from "~/assets/spritesheet/types"

export type LinkAction = {
  label: string
  icon: IconName
  link: ReturnType<typeof linkOptions>
}

export type EventAction = {
  label: string
  icon: IconName
  event: string
}

export type Action = LinkAction | EventAction

export type NavigationItem = {
  label: string
  icon: IconName
  link: ReturnType<typeof linkOptions>
}

export const navigation = {
  home: {
    label: "Home",
    icon: "Home",
    link: linkOptions({
      to: "/",
      disabled: true,
    }),
  },
  about: {
    label: "About",
    icon: "Help",
    link: linkOptions({
      to: "/about",
      disabled: false,
    }),
  },
  lounge: {
    label: "Artists Lounge",
    icon: "Diversity",
    link: linkOptions({
      to: "/lounge",
      disabled: true,
    }),
  },
  art: {
    label: "Artist Raid Train",
    icon: "Train",
    link: linkOptions({
      to: "/art",
      disabled: true,
    }),
  },
  calendar: {
    label: "Calendar",
    icon: "Calendar",
    link: linkOptions({
      to: "/calendar",
      disabled: true,
    }),
  },
} satisfies Record<string, NavigationItem>

export const navigationEntries = Object.entries(navigation)
