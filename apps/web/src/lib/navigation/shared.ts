import type { Props } from "~/components/NavLink"
import type { IconName } from "../icons"

export type NavigationEventAction = {
  label: string
  icon: IconName
  event: string
}

export type NavigationLinkAction = {
  label: string
  icon: IconName
  link: Props
}

export type NavigationAction = NavigationEventAction | NavigationLinkAction

export type NavigationItem = {
  id: string
  label: string
  icon: IconName
  link: Props
  search?: boolean | string
  actions: NavigationAction[]
}

export const navigation = [
  {
    id: "home",
    label: "Home",
    icon: "Home",
    link: {
      href: "/",
      disabled: false,
    },
    actions: [],
  },
  {
    id: "about",
    label: "About",
    icon: "Help",
    link: {
      href: "/about",
      disabled: false,
    },
    search: "Search something",
    actions: [
      {
        label: "Twitch",
        icon: "Twitch",
        link: {
          href: "https://www.twitch.tv/artiststogether",
          target: "_blank,",
        },
      },
      {
        label: "Discord",
        icon: "Discord",
        link: {
          href: "https://discord.gg/9Ayh9dvhHe",
          target: "_blank,",
        },
      },
      {
        label: "Instagram",
        icon: "Instagram",
        link: {
          href: "https://www.instagram.com/artiststogether.online",
          target: "_blank,",
        },
      },
    ],
  },
  {
    id: "lounge",
    label: "Artists Lounge",
    icon: "Diversity",
    link: {
      href: "/lounge",
      disabled: false,
    },
    actions: [],
  },
  {
    id: "art",
    label: "Artist Raid Train",
    icon: "Train",
    link: {
      href: "/art",
      disabled: false,
    },
    actions: [],
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: "Calendar",
    link: {
      href: "/calendar",
      match: "^\/calendar",
      disabled: false,
    },
    actions: [],
  },
] satisfies NavigationItem[]

export function matches(
  pathname: string,
  props: Pick<Props, "href" | "match">,
) {
  return typeof props.match === "string"
    ? new RegExp(props.match).test(pathname)
    : pathname === props.href.toString()
}
