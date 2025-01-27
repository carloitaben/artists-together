"use client"

import { Dialog } from "@ark-ui/react/dialog"
import { useSearchParams } from "next/navigation"
import type { ComponentProps } from "react"

type Props = ComponentProps<typeof Dialog.Root>

export default function AuthRoot(props: Props) {
  const search = useSearchParams()
  const open = search.get("modal") === "auth"

  return (
    <Dialog.Root
      {...props}
      open={open}
      onOpenChange={(details) => {
        if (!details.open) {
          const url = new URL(window.location.href)
          url.searchParams.delete("modal")
          window.history.replaceState(null, "", url)
        }
      }}
    />
  )
}
