"use client"

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react"
import * as Dialog from "@radix-ui/react-dialog"

type Props = Dialog.DialogProps

type ModalContext = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const rootModalContext = createContext<ModalContext | null>(null)

export function useRootModalContext() {
  const value = useContext(rootModalContext)

  if (!value) {
    throw Error("Used useModalContext outside of modal root")
  }

  return value
}

export default function Root({ children }: Props) {
  const [open, setOpen] = useState(false)

  const value: ModalContext = {
    open,
    setOpen,
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <rootModalContext.Provider value={value}>
        {children}
      </rootModalContext.Provider>
    </Dialog.Root>
  )
}
