"use client"

import { Toast, Toaster, createToaster } from "@ark-ui/react"
import Icon from "./Icon"

export const toaster = createToaster({
  placement: "bottom",
  overlap: false,
  max: 3,
})

export default function Toasts() {
  return (
    <Toaster toaster={toaster}>
      {(toast) => (
        <Toast.Root
          key={toast.id}
          className="bg-not-so-white text-gunpla-white-700 shadow-button selection:bg-gunpla-white-300 selection:text-gunpla-white-900 z-[--z-index] flex translate-y-[--y] items-center justify-center whitespace-nowrap rounded-full pl-6 text-sm opacity-[--opacity] transition-all"
        >
          {toast.title ? <Toast.Title>{toast.title}</Toast.Title> : null}
          {toast.description ? (
            <Toast.Description>{toast.description}</Toast.Description>
          ) : null}
          <Toast.CloseTrigger className="grid size-12 place-items-center">
            <Icon src="Close" alt="Close" className="size-4" />
          </Toast.CloseTrigger>
        </Toast.Root>
      )}
    </Toaster>
  )
}
