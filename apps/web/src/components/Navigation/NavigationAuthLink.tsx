"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import type { ComponentProps } from "react"

type Props = Omit<ComponentProps<typeof Link>, "href">

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
