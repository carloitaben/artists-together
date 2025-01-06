import { Switch } from "@ark-ui/react/switch"
import type { ComponentProps } from "react"

type Props = ComponentProps<typeof Switch.Control>

export default function SwitchControl(props: Props) {
  return (
    <Switch.Control
      className="h-8 w-[3.75rem] rounded-full bg-gunpla-white-300 p-1 shadow-inner"
      {...props}
    >
      <Switch.Thumb className="inline-block size-6 rounded-full bg-gunpla-white-500 shadow transition data-[state='checked']:translate-x-7 data-[state='checked']:bg-not-so-white" />
    </Switch.Control>
  )
}

