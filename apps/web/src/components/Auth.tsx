"use client"

import { useTransition } from "react"
import { usePathname } from "next/navigation"
import { isRedirectError } from "next/dist/client/components/redirect"

import { discordSSO } from "~/actions/auth"
import { useToast } from "~/components/Toast"
import * as Modal from "~/components/Modal"
import Button from "~/components/Button"
import Icon from "~/components/Icon"

export default function Auth() {
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
            color="disabled"
            className="bg-[#5865F2] text-gunpla-white-50"
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
            <Icon icon="discord" label="" className="w-6" />
            Log-in with Discord
          </Button>
        </div>
      </Modal.Content>
    </Modal.Portal>
  )
}
