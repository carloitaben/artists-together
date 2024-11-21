import type { IconName } from "~/assets/spritesheet/types"

export const sections = [
  "profile",
  "social-media",
  "advanced-settings",
  "contact-support",
] as const

export type Sections = typeof sections

export type Section = Sections[number]

export type SectionData = {
  label: string
  icon: IconName
}

export const sectionData = {
  profile: {
    label: "Profile",
    icon: "Face",
  },
  "social-media": {
    label: "Social media",
    icon: "CaptivePortal",
  },
  "advanced-settings": {
    label: "Advanced settings",
    icon: "Settings",
  },
  "contact-support": {
    label: "Contact support",
    icon: "ContactSupport",
  },
} satisfies Record<Section, SectionData>
