"use client"

import {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react"
import { Root, DialogProps } from "@radix-ui/react-dialog"

export * from "@radix-ui/react-dialog"

type Context = [open: boolean, setOpen: Dispatch<SetStateAction<boolean>>]

const context = createContext<Context | null>(null)

export function useControlledDialog() {
  const value = useContext(context)

  if (!value) {
    throw Error("Called useControlledDialog outside of Dialog.ControlledRoot")
  }

  return value
}

export function ControlledRoot({
  children,
  open = false,
  onOpenChange,
  ...props
}: Omit<DialogProps, "defaultOpen">) {
  const state = useState(open)

  const onChange = useCallback(
    (open: boolean) => {
      onOpenChange?.(open)
      state[1](open)
    },
    [onOpenChange, state]
  )

  return (
    <Root open={state[0]} onOpenChange={onChange}>
      <context.Provider value={state}>{children}</context.Provider>
    </Root>
  )
}
