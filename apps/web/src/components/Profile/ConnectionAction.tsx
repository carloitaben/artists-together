"use client"

import { useTransition, ComponentProps } from "react"
import { usePathname } from "next/navigation"
import { isRedirectError } from "next/dist/client/components/redirect"
import { useToast } from "~/components/Toast"
import type Connection from "./Connection"

type Props = ComponentProps<"button"> &
  Pick<ComponentProps<typeof Connection>, "action">

export default function ConnectionAction({
  action,
  children,
  disabled,
  ...props
}: Props) {
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()
  const emit = useToast()

  return (
    <button
      {...props}
      className="block w-full rounded-2xl"
      disabled={disabled || isPending}
      onClick={() =>
        startTransition(async () => {
          await action({ pathname }).catch((error) => {
            if (isRedirectError(error)) throw error
            console.error(error)
            emit.error()
          })
        })
      }
    >
      {children}
    </button>
  )
}
