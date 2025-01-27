"use client"

import Link from "next/link"
import type { ComponentProps } from "react"
import { useMatches } from "~/lib/navigation/client"

import { anchor } from "./Anchor"
import { useRouterTransition } from "~/lib/transition"
import { useRouter } from "next/navigation"

export type Props = ComponentProps<typeof Link> & {
  match?: string
  disabled?: boolean
}

export default function NavLink({ href, match, disabled, ...props }: Props) {
  const [, startTransition] = useRouterTransition()
  const router = useRouter()
  const matches = useMatches({ href, match })
  const aria = matches
    ? {
        "aria-current": "page" as const,
      }
    : undefined

  return (
    <Link
      {...props}
      {...aria}
      href={href}
      onClick={(event) => {
        props.onClick?.(event)

        if (matches) {
          event.preventDefault()
          return anchor(event)
        }

        startTransition(href.toString(), () => {
          router.push(href.toString())
        })
      }}
    />
  )
}
