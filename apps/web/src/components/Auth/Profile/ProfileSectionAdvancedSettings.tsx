"use client"

import { UserSettings } from "@artists-together/core/database"
import { useMutation } from "@tanstack/react-query"
import { Switch } from "@ark-ui/react/switch"
import { getFormProps, getInputProps } from "@conform-to/react"
import { useUser } from "~/lib/promises"
import { updateProfile } from "~/lib/actions"
import { useFormMutation } from "~/lib/mutations"
import SwitchControl from "~/components/SwitchControl"
import InlineTooltip from "~/components/InlineTooltip"
import DialogTitle from "../DialogTitle"
import { sectionData } from "./lib"
import ProfileDialogContainer from "./ProfileDialogContainer"

type Setting = {
  name: keyof UserSettings
  label: string
  tooltip?: string
}

const settings = [
  {
    name: "fullHourFormat",
    label: "24-hour time format",
  },
  {
    name: "shareStreaming",
    label: "Share streaming status",
    tooltip:
      "We use your approximate location (region) to let other members know your timezone.",
  },
  {
    name: "shareCursor",
    label: "Share cursor location",
    tooltip:
      "We use your approximate location (region) to let other members know your timezone.",
  },
  {
    name: "fahrenheit",
    label: "Temperature in Fahrenheit",
  },
] satisfies Setting[]

export default function ProfileSectionAdvancedSettings() {
  const section = sectionData["advanced-settings"]

  const user = useUser()
  const mutation = useMutation({
    async mutationFn(formData: FormData) {
      return updateProfile(formData)
    },
  })

  const [form, fields] = useFormMutation({
    mutation,
    schema: UserSettings,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    defaultValue: user?.settings,
  })

  return (
    <ProfileDialogContainer id="advanced-settings">
      <DialogTitle sm="inter" className="pb-4 md:pb-6">
        {section.label}
      </DialogTitle>
      <form {...getFormProps(form)} className="space-y-2">
        {settings.map((setting) => (
          <Switch.Root
            {...getInputProps(fields[setting.name], { type: "checkbox" })}
            key={setting.name}
            className="flex items-center justify-between"
          >
            <Switch.Label className="flex items-center gap-x-2 text-sm md:px-3.5">
              {setting.tooltip ? (
                <InlineTooltip tooltip={setting.tooltip}>
                  <span>{setting.label}</span>
                </InlineTooltip>
              ) : (
                <span>{setting.label}</span>
              )}
            </Switch.Label>
            <Switch.HiddenInput />
            <SwitchControl />
          </Switch.Root>
        ))}
      </form>
    </ProfileDialogContainer>
  )
}
