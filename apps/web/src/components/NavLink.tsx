"use client"

import Link, { type LinkProps } from "next/link"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"
import { useMatches } from "~/lib/navigation/client"
import { useRouterTransition } from "~/lib/transition"
import { anchor } from "./Anchor"

// Copied from  https://github.com/vercel/next.js/blob/canary/packages/next/src/client/link.tsx#L180-L191
function isModifiedEvent(event: React.MouseEvent): boolean {
  const eventTarget = event.currentTarget as HTMLAnchorElement | SVGAElement
  const target = eventTarget.getAttribute("target")
  return (
    (target && target !== "_self") ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey || // triggers resource download
    (event.nativeEvent && event.nativeEvent.which === 2)
  )
}

export type Props = LinkProps & {
  match?: string
  disabled?: boolean
  children?: ReactNode
  className?: string
}

export default function NavLink({
  href,
  match,
  disabled,
  prefetch,
  ...props
}: Props) {
  const [isPending, startTransition] = useRouterTransition()
  const router = useRouter()
  const matches = useMatches({ href, match })
  const aria = matches
    ? {
        "aria-current": "page" as const,
      }
    : undefined

  if (disabled) {
    return <a {...props} {...aria} draggable={false} />
  }

  return (
    <Link
      {...props}
      {...aria}
      href={href}
      draggable={false}
      prefetch={prefetch}
      onClick={(event) => {
        props.onClick?.(event)

        if (isModifiedEvent(event)) {
          return
        }

        if (matches) {
          event.preventDefault()
          return anchor(event)
        }

        if (isPending) return

        startTransition(href.toString(), () => {
          router.push(href.toString())
        })
      }}
    />
  )
}
