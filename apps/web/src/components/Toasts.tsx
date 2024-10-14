"use client"

import { Toast, Toaster, createToaster } from "@ark-ui/react/toast"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import Icon from "./Icon"

export const toaster = createToaster({
  placement: "bottom",
  overlap: false,
  max: 3,
})

export default function Toasts() {
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    const toast = params.get("toast")
    const error = params.get("error")

    if (!toast && error === null) return

    toaster.create({
      title: toast || error || "Oops! Something went wrong…",
      type: error ? "error" : "info",
    })

    const url = new URL(location.href)
    url.searchParams.delete("toast")
    url.searchParams.delete("error")
    router.replace(url.href)
  }, [params, router])

  return (
    <Toaster toaster={toaster}>
      {(toast) => (
        <Toast.Root
          key={toast.id}
          className="z-[--z-index] flex translate-y-[--y] items-center justify-center whitespace-nowrap rounded-full bg-not-so-white pl-6 text-sm text-gunpla-white-700 opacity-[--opacity] shadow-button transition-all selection:bg-gunpla-white-300 selection:text-gunpla-white-900"
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
