"use client"

import { Dialog } from "@ark-ui/react/dialog"
import { useRouter, useSearchParams } from "next/navigation"
import type { ReactNode } from "react"
import { useEffect } from "react"

type Props = {
  children: ReactNode
}

export default function Root({ children }: Props) {
  const router = useRouter()
  const params = useSearchParams()
  const opened = params.get("modal") === "auth"

  useEffect(() => {
    if (opened) {
      const url = new URL(location.href)
      url.searchParams.delete("modal")
      router.replace(url.href)
    }
  }, [opened, router])

  return <Dialog.Root defaultOpen={opened}>{children}</Dialog.Root>
}
