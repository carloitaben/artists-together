"use client"

import type { LinkProps } from "next/link"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import type { ReactNode } from "react"

type Props = Omit<LinkProps, "href"> & {
  children?: ReactNode
  className?: string
}

export default function NavigationAuthLink({
  prefetch = false,
  ...props
}: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const urlSearchParams = new URLSearchParams(searchParams)
  urlSearchParams.set("modal", "auth")

  return (
    <Link
      {...props}
      draggable={false}
      prefetch={prefetch}
      onClick={(event) => {
        event.preventDefault()
        const url = new URL(window.location.href)
        url.searchParams.set("modal", "auth")
        window.history.pushState(null, "", url)
      }}
      href={{
        pathname,
        search: urlSearchParams.toString(),
      }}
      rel="nofollow"
    />
  )
}
