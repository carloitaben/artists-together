"use client"

import { createToaster, Toast, Toaster } from "@ark-ui/react/toast"
import { cva, type VariantProps } from "cva"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import Icon from "./Icon"

export const toaster = createToaster({
  placement: "bottom-end",
  offsets: "1rem",
  overlap: false,
  max: 3,
})

const variants = cva({
  base: [
    "z-[--z-index] translate-y-[--y] opacity-[--opacity]",
    "pl-6 flex items-center justify-center whitespace-nowrap rounded-4 test-sm shadow-button transition-all",
  ],
  variants: {
    type: {
      warn: "bg-physical-orange-300 text-physical-orange-700 selection:bg-physical-orange-700 selection:text-physical-orange-300",
      error:
        "bg-acrylic-red-300 text-acrylic-red-700 selection:bg-acrylic-red-700 selection:text-acrylic-red-300",
      info: "bg-ruler-cyan-300 text-ruler-cyan-700 selection:bg-ruler-cyan-700 selection:text-ruler-cyan-300",
      success:
        "bg-natural-khaki-300 text-natural-khaki-700 selection:bg-natural-khaki-700 selection:text-natural-khaki-300",
      neutral:
        "bg-gunpla-white-50 text-gunpla-white-500 selection:bg-gunpla-white-500 selection:text-gunpla-white-50",
    },
  },
})

type Variants = VariantProps<typeof variants>

export default function Toasts() {
  const search = useSearchParams()

  useEffect(() => {
    const toast = search.get("toast")
    const error = search.get("error")

    if (toast === null && error === null) return

    queueMicrotask(() => {
      toaster.create({
        title: toast || error || "Oops! Something went wrong…",
        type: error ? "error" : "neutral",
      })
    })

    const url = new URL(window.location.href)
    url.searchParams.delete("toast")
    url.searchParams.delete("error")
    window.history.replaceState(null, "", url)
  }, [search])

  return (
    <Toaster toaster={toaster} className="!z-[100]">
      {(toast) => (
        <Toast.Root
          key={toast.id}
          className={variants({ type: toast.type as Variants["type"] })}
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
