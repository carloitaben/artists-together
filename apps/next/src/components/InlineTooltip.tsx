import { Tooltip } from "@ark-ui/react"
import type { ReactNode } from "react"
import Icon from "~/components/Icon"

type Props = {
  children: ReactNode
  tooltip: string
}

export default function InlineTooltip({ children, tooltip }: Props) {
  return (
    <>
      <Tooltip.Root
        openDelay={0}
        closeDelay={0}
        closeOnEscape={false}
        interactive={false}
        positioning={{
          placement: "bottom-end",
        }}
      >
        <Tooltip.Trigger asChild>
          <span>
            <Icon src="Info" alt="More info" className="size-3.5" />
          </span>
        </Tooltip.Trigger>
        <Tooltip.Positioner>
          <Tooltip.Content className="mr-[1.125rem] mt-1 w-56 rounded-b-4 rounded-tl-4 rounded-tr-0.5 bg-gunpla-white-500 px-4 py-3 text-gunpla-white-50 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]">
            {tooltip}
          </Tooltip.Content>
        </Tooltip.Positioner>
      </Tooltip.Root>
      {children}
    </>
  )
}
