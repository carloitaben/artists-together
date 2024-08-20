"use client"

import type {
  ComponentPropsWithoutRef,
  ComponentRef,
  ForwardedRef,
} from "react"
import { forwardRef } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"

type Props = Omit<ComponentPropsWithoutRef<typeof Link>, "href"> & {
  href: string
  mode: "page" | "layout"
}

function stripQueryParameters(href: string) {
  return String(href.split("?")[0])
}

function NavLink(
  { href, mode, ...props }: Props,
  ref: ForwardedRef<ComponentRef<typeof Link>>,
) {
  const pathname = usePathname()

  const selected =
    mode === "layout"
      ? pathname.startsWith(href)
      : pathname === stripQueryParameters(href)

  return <Link {...props} href={href} ref={ref} aria-selected={selected} />
}

export default forwardRef(NavLink)
