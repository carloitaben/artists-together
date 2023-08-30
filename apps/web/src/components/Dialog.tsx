"use client"

import { Root, DialogProps } from "@radix-ui/react-dialog"
import { useCallback, useState } from "react"
import { createStateContext } from "~/hooks/state"

const [ControlledDialogContext, useControlledDialog] =
  createStateContext<boolean>()

ControlledDialogContext.displayName = "ControlledDialogContext"

function ControlledRoot({
  open = false,
  onOpenChange,
  children,
  ...props
}: Omit<DialogProps, "defaultOpen">) {
  const [opened, setOpened] = useState(open)

  const onChange = useCallback<NonNullable<DialogProps["onOpenChange"]>>(
    (value) => {
      setOpened(value)
      if (onOpenChange) onOpenChange(value)
    },
    [onOpenChange],
  )

  return (
    <ControlledDialogContext.Provider value={[opened, setOpened]}>
      <Root {...props} open={opened} onOpenChange={onChange}>
        {children}
      </Root>
    </ControlledDialogContext.Provider>
  )
}

export * from "@radix-ui/react-dialog"
export { ControlledRoot, useControlledDialog }
