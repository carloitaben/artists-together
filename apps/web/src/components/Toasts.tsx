"use client"

import { createToaster,Toast, Toaster } from "@ark-ui/react/toast"
import { cx } from "cva"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import Icon from "./Icon"

export const toaster = createToaster({
  placement: "bottom",
  overlap: false,
  max: 3,
})

export default function Toasts() {
  const search = useSearchParams()

  useEffect(() => {
    const toast = search.get("toast")
    const error = search.get("error")

    if (toast === null && error === null) return

    toaster.create({
      title: toast || error || "Oops! Something went wrong…",
      type: error ? "error" : "info",
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
          className={cx(
            "z-[--z-index] translate-y-[--y] opacity-[--opacity]",
            "flex items-center justify-center whitespace-nowrap rounded-full bg-not-so-white pl-6 text-sm text-gunpla-white-700 shadow-button transition-all",
            "selection:bg-gunpla-white-300 selection:text-gunpla-white-900",
          )}
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
