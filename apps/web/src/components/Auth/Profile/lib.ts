import { useForm } from "@conform-to/react"
import { parseWithValibot } from "conform-to-valibot"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import type { IconName } from "~/assets/spritesheet/types"
import { UpdateProfileFormSchema } from "~/lib/schemas"
import { authenticateQueryOptions } from "~/services/auth/queries"

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

export function useUpdateProfileForm() {
  const auth = useSuspenseQuery(authenticateQueryOptions)

  if (!auth.data) {
    throw Error("Unauthorized")
  }

  const mutation = useMutation({
    mutationFn: async ({ data }: { data: FormData }) => {
      console.log("updating...", Object.fromEntries(data.entries()))
    },
    onSuccess() {
      console.log("updated :)")
    },
  })

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithValibot(formData, {
        schema: UpdateProfileFormSchema,
      })
    },
    async onSubmit(event, context) {
      event.preventDefault()
      await mutation.mutateAsync({
        data: context.formData,
      })
    },
    defaultValue: {
      bio: auth.data.user.bio,
    },
  })

  return { mutation, form, fields } as const
}
