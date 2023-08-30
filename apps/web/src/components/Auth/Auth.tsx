"use client"

import { useTransition } from "react"
import { usePathname } from "next/navigation"
import { DialogTriggerProps } from "@radix-ui/react-dialog"

import { discordSSO } from "~/actions/auth"
import { useToast } from "~/components/Toast"
import * as Modal from "~/components/Modal"
import { isRedirectError } from "next/dist/client/components/redirect"

type Props = DialogTriggerProps

export default function Auth({ children, ...props }: Props) {
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()
  const emit = useToast()

  return (
    <Modal.Root>
      <Modal.Trigger {...props}>{children}</Modal.Trigger>
      <Modal.Portal>
        <Modal.Content>
          <Modal.Container>
            <Modal.Title>Welcome to Artists Together</Modal.Title>
            <Modal.Description>
              We will be using Discord to manage your Artists Together account.
            </Modal.Description>
          </Modal.Container>
          <button
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
            Log-in with Discord
          </button>
        </Modal.Content>
      </Modal.Portal>
    </Modal.Root>
  )
}
