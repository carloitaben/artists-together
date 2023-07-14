"use client"

import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import NextLink from "next/link"
import { usePathname } from "next/navigation"
import { ComponentProps, ForwardedRef, forwardRef } from "react"

function Link(
  { href, children, ...props }: ComponentProps<typeof NextLink>,
  ref: ForwardedRef<HTMLAnchorElement>
) {
  const pathname = usePathname()
  const active = pathname === href

  return (
    <NavigationMenu.Item>
      <NavigationMenu.Link ref={ref} asChild active={active} className="group">
        <NextLink {...props} href={href}>
          {children}
        </NextLink>
      </NavigationMenu.Link>
    </NavigationMenu.Item>
  )
}

export default forwardRef(Link)
