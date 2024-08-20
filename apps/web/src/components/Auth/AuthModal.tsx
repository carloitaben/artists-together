"use client"

import { Dialog } from "@ark-ui/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import type { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export default function AuthModal({ children }: Props) {
  const router = useRouter()
  const params = useSearchParams()
  const opened = params.get("modal") === "auth"

  useEffect(() => {
    if (opened) {
      const url = new URL(window.location.href)
      url.searchParams.delete("modal")
      router.replace(url.href)
    }
  }, [opened, router])

  return <Dialog.Root defaultOpen={opened}>{children}</Dialog.Root>
}
