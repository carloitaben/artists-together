"use client"

import { Switch } from "@ark-ui/react/switch"
import { getFormProps, getInputProps } from "@conform-to/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import SwitchControl from "~/components/SwitchControl"
import { updateProfileSettings } from "~/features/auth/actions"
import { userQueryOptions } from "~/features/auth/shared"
import { useFormMutation } from "~/lib/mutations"
import { useSettings } from "~/lib/promises"
import { Settings, SettingsUpdate } from "~/lib/schemas"
import DialogTitle from "../DialogTitle"
import { sectionData } from "./lib"
import ProfileDialogContainer from "./ProfileDialogContainer"

type Setting = {
  name: keyof Settings
  label: string
  tooltip?: string
}

const inputs = [
  {
    name: "fullHourFormat",
    label: "24-hour time format",
  },
  {
    name: "fahrenheit",
    label: "Temperature in Fahrenheit",
  },
] satisfies Setting[]

export default function ProfileSectionAdvancedSettings() {
  const section = sectionData["advanced-settings"]

  const settings = useSettings()
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
    schema: SettingsUpdate,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    defaultValue: settings,
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
        {inputs.map((input) => (
          <div key={input.name}>
            <Switch.Root
              {...getInputProps(fields[input.name], { type: "checkbox" })}
              className="flex items-center justify-between"
              defaultChecked={fields[input.name].initialValue === "on"}
            >
              <Switch.Label className="flex items-center gap-x-2 text-sm md:px-3.5">
                <span>{input.label}</span>
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
