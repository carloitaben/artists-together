"use client"

import { Switch } from "@ark-ui/react/switch"
import { UserSettings } from "@artists-together/core/database"
import { getFormProps, getInputProps } from "@conform-to/react"
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import SwitchControl from "~/components/SwitchControl"
import { updateProfileSettings } from "~/features/auth/actions"
import { userQueryOptions } from "~/features/auth/shared"
import { useFormMutation } from "~/lib/mutations"
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
    // tooltip:
    //   "We use your approximate location (region) to let other members know your timezone.",
  },
  {
    name: "shareCursor",
    label: "Share cursor location",
    // tooltip:
    //   "We use your approximate location (region) to let other members know your timezone.",
  },
  {
    name: "fahrenheit",
    label: "Temperature in Fahrenheit",
  },
] satisfies Setting[]

export default function ProfileSectionAdvancedSettings() {
  const section = sectionData["advanced-settings"]

  const user = useSuspenseQuery(userQueryOptions)
  const queryClient = useQueryClient()
  const mutation = useMutation({
    async mutationFn(formData: FormData) {
      return updateProfileSettings(formData)
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: userQueryOptions.queryKey,
      })
    },
  })

  const [form, fields] = useFormMutation({
    mutation,
    schema: UserSettings,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    defaultValue: user.data?.settings,
  })

  return (
    <ProfileDialogContainer id="advanced-settings">
      <DialogTitle sm="inter" className="pb-4 md:pb-6">
        {section.label}
      </DialogTitle>
      <form
        {...getFormProps(form)}
        className="space-y-2"
        onChange={(event) => {
          if (!(event.target instanceof HTMLInputElement)) return
          event.currentTarget.requestSubmit()
        }}
      >
        {settings.map((setting) => (
          <div key={setting.name}>
            <Switch.Root
              {...getInputProps(fields[setting.name], { type: "checkbox" })}
              className="flex items-center justify-between"
              defaultChecked={fields[setting.name].initialValue === "on"}
            >
              <Switch.Label className="flex items-center gap-x-2 text-sm md:px-3.5">
                {/* {setting.tooltip ? (
                  <InlineTooltip tooltip={setting.tooltip}>
                    <span>{setting.label}</span>
                  </InlineTooltip>
                ) : (
                  <span>{setting.label}</span>
                )} */}
                <span>{setting.label}</span>
              </Switch.Label>
              <SwitchControl />
              <Switch.HiddenInput />
            </Switch.Root>
          </div>
        ))}
      </form>
    </ProfileDialogContainer>
  )
}
