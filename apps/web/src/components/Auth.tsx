"use client"

import { useEffect, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { isRedirectError } from "next/dist/client/components/redirect"
import { DialogProps } from "@radix-ui/react-dialog"

import { discordSSO } from "~/actions/auth"
import { useToast } from "~/components/Toast"
import * as Modal from "~/components/Modal"
import Button from "~/components/Button"
import Icon from "~/components/Icon"

export function Root(props: DialogProps) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open || params.get("modal") !== "login") return
    setOpen(true)
    const newParams = new URLSearchParams(params)
    newParams.delete("modal")
    router.push(pathname + "?" + newParams.toString())
  }, [open, params, pathname, router])

  return <Modal.Root {...props} open={open} onOpenChange={setOpen} />
}

export const Trigger = Modal.Trigger

export function Content() {
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()
  const emit = useToast()

  return (
    <Modal.Portal>
      <Modal.Content>
        <Modal.Container>
          <Modal.Title>Welcome to Artists Together</Modal.Title>
          <Modal.Description>
            We will be using Discord to manage your Artists Together account.
          </Modal.Description>
        </Modal.Container>
        <div className="mt-2 flex justify-end">
          <Button
            color={false}
            className="bg-[#5865F2] text-gunpla-white-50 disabled:bg-gunpla-white-100 disabled:text-gunpla-white-400"
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                await discordSSO({ pathname }).catch((error) => {
                  if (isRedirectError(error)) throw error
                  console.error(error)
                  emit.error()
                })
              })
            }
          >
            <Icon icon="discord" label="" className="h-6 w-6" />
            Log-in with Discord
          </Button>
        </div>
      </Modal.Content>
    </Modal.Portal>
  )
}
