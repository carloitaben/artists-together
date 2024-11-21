import { Tooltip, type TooltipRootProps } from "@ark-ui/react/tooltip"
import { cx } from "cva"
import type { ReactNode } from "react"
import Icon from "~/components/Icon"

type Props = {
  placement?: NonNullable<TooltipRootProps["positioning"]>["placement"]
  children: ReactNode
  tooltip: string
  alt?: string
}

export default function InlineTooltip({
  children,
  tooltip,
  alt = "More info",
  placement = "left-start",
}: Props) {
  return (
    <>
      <Tooltip.Root
        // closeDelay={0}
        // openDelay={200}
        // positioning={{
        //   gutter: 0,
        //   offset: { crossAxis: 0, mainAxis: 0 },
        //   placement,
        // }}
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
            <Icon src="Info" alt={alt} className="size-3.5" />
          </span>
        </Tooltip.Trigger>
        <Tooltip.Positioner>
          <Tooltip.Content
            className={cx(
              "mr-[1.125rem] mt-1 w-56 rounded-b-4 bg-gunpla-white-500 px-4 py-3 text-gunpla-white-50 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]",
              {
                "rounded-tl-4 rounded-tr-0.5": placement.includes("left"),
                "rounded-tl-0.5 rounded-tr-4": placement.includes("right"),
              },
            )}
          >
            {tooltip}
          </Tooltip.Content>
        </Tooltip.Positioner>
      </Tooltip.Root>
      {children}
    </>
  )
}
