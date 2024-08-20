"use client"

import { Toast as ToastPrimitive, Toaster, createToaster } from "@ark-ui/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import Icon from "~/components/Icon"

const toaster = createToaster({
  placement: "bottom",
  overlap: false,
  max: 1,
  duration: 10_000,
})

let id: string | undefined = undefined

type EmitToastOptions = Parameters<typeof toaster.create>[0]

export function emit(config: EmitToastOptions) {
  if (id) {
    toaster.update(id, config)
  } else {
    id = toaster.create(config)
  }
}

export default function Toast() {
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    const message = params.get("toast")

    if (!message) {
      return
    }

    const url = new URL(window.location.href)
    url.searchParams.delete("toast")
    router.replace(url.href)
    emit({ title: message })
  }, [params, router])

  return (
    <Toaster toaster={toaster}>
      {(toast) => (
        <ToastPrimitive.Root
          key={toast.id}
          className="flex items-center whitespace-nowrap rounded-full bg-not-so-white pl-6 text-sm text-gunpla-white-700 shadow-button"
        >
          <ToastPrimitive.Title>{toast.title}</ToastPrimitive.Title>
          <ToastPrimitive.CloseTrigger className="grid size-12 place-items-center">
            <Icon name="close" alt="Close" className="size-4" />
          </ToastPrimitive.CloseTrigger>
        </ToastPrimitive.Root>
      )}
    </Toaster>
  )
}
