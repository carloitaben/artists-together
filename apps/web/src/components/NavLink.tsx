"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ComponentProps, ComponentRef, ForwardedRef } from "react"
import { forwardRef } from "react"

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string
  /**
   * Changes the matching logic to only match to the "end" of the path.
   * If the URL is longer than href, it will no longer be considered active.
   *
   * @default true
   */
  end?: boolean
}

function NavLink(
  { end = true, href, ...props }: Props,
  ref: ForwardedRef<ComponentRef<typeof Link>>,
) {
  const pathname = usePathname()
  const active = end ? pathname === href : pathname.startsWith(href)
  const activeProps = active ? ({ "aria-current": "page" } as const) : undefined

  return <Link ref={ref} href={href} {...props} {...activeProps} />
}

export default forwardRef(NavLink)
