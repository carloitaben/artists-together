import type { TooltipRootProps } from "@ark-ui/react"
import { Tooltip as TooltipPrimitive } from "@ark-ui/react"
import { cx } from "cva"
import type { ReactNode } from "react"
import Icon from "~/components/Icon"

type Props = {
  children: ReactNode
  placement?: NonNullable<TooltipRootProps["positioning"]>["placement"]
  alt?: string
}

export default function Tooltip({
  alt = "More info",
  placement = "left-start",
  children,
}: Props) {
  return (
    <TooltipPrimitive.Root
      closeDelay={0}
      openDelay={200}
      positioning={{
        gutter: 0,
        offset: { crossAxis: 0, mainAxis: 0 },
        placement,
      }}
    >
      <TooltipPrimitive.Trigger type="button">
        <Icon alt={alt} name="info" className="size-3.5" />
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Positioner>
        <TooltipPrimitive.Content
          className={cx(
            "mt-3.5 w-full max-w-[15rem] rounded-b-2xl bg-gunpla-white-500 px-4 py-3 text-gunpla-white-50 shadow-card",
            {
              "rounded-tl-2xl rounded-tr-sm": placement.includes("left"),
              "rounded-tl-sm rounded-tr-2xl": placement.includes("right"),
            },
          )}
        >
          {children}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Root>
  )
}
