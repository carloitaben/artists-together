"use client"

import { Root, TabsProps } from "@radix-ui/react-tabs"
import { useState, useCallback } from "react"
import { createStateContext } from "~/hooks/state"

const [ControlledTabsContext, useControlledTabs] =
  createStateContext<TabsProps["value"]>()

ControlledTabsContext.displayName = "ControlledTabsContext"

function ControlledRoot({
  value,
  onValueChange,
  children,
  ...props
}: Omit<TabsProps, "defaultValue">) {
  const [currentValue, setCurrentValue] = useState(value)

  const onChange = useCallback<NonNullable<TabsProps["onValueChange"]>>(
    (value) => {
      setCurrentValue(value)
      if (onValueChange) onValueChange(value)
    },
    [onValueChange],
  )

  return (
    <ControlledTabsContext.Provider value={[currentValue, setCurrentValue]}>
      <Root {...props} value={currentValue} onValueChange={onChange}>
        {children}
      </Root>
    </ControlledTabsContext.Provider>
  )
}

export * from "@radix-ui/react-tabs"
export { ControlledRoot, useControlledTabs }
