import { Switch } from "@ark-ui/react/switch"
import SwitchControl from "~/components/SwitchControl"
import InlineTooltip from "~/components/InlineTooltip"
import DialogContainer from "../DialogContainer"
import DialogTitle from "../DialogTitle"
import { sectionData } from "./lib"

type Setting = {
  name: string
  label: string
  tooltip?: string
}

const settings = [
  {
    name: "0",
    label: "24-hour time format",
  },
  {
    name: "1",
    label: "Share approximate location",
    tooltip:
      "We use your approximate location (region) to let other members know your timezone.",
  },
  {
    name: "2",
    label: "Share streaming status",
    tooltip:
      "We use your approximate location (region) to let other members know your timezone.",
  },
  {
    name: "3",
    label: "Share cursor location",
    tooltip:
      "We use your approximate location (region) to let other members know your timezone.",
  },
  {
    name: "4",
    label: "Temperature in Fahrenheit",
  },
] satisfies Setting[]

export default function ProfileSectionAdvancedSettings() {
  const section = sectionData["advanced-settings"]

  return (
    <DialogContainer id="advanced-settings">
      <DialogTitle className="pb-6">{section.label}</DialogTitle>
      <form className="space-y-2">
        {settings.map((setting) => (
          <Switch.Root
            key={setting.name}
            name={setting.name}
            className="flex items-center justify-between"
          >
            <Switch.Label className="flex items-center gap-x-2 px-3.5">
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
    </DialogContainer>
  )
}
