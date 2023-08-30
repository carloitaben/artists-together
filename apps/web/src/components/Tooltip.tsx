"use client"

import { Root, TooltipProps } from "@radix-ui/react-tooltip"
import { useCallback } from "react"
import { useState } from "react"
import { createStateContext } from "~/hooks/state"

const [ControlledTooltipContext, useControlledTooltip] =
  createStateContext<boolean>()

ControlledTooltipContext.displayName = "ControlledTooltipContext"

function ControlledRoot({
  open = false,
  onOpenChange,
  children,
  ...props
}: Omit<TooltipProps, "defaultOpen">) {
  const [opened, setOpened] = useState(open)

  const onChange = useCallback<NonNullable<TooltipProps["onOpenChange"]>>(
    (value) => {
      setOpened(value)
      if (onOpenChange) onOpenChange(value)
    },
    [onOpenChange],
  )

  return (
    <ControlledTooltipContext.Provider value={[opened, setOpened]}>
      <Root {...props} open={opened} onOpenChange={onChange}>
        {children}
      </Root>
    </ControlledTooltipContext.Provider>
  )
}

export * from "@radix-ui/react-tooltip"
export { ControlledRoot, useControlledTooltip }
