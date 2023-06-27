"use client"

import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import * as Tooltip from "@radix-ui/react-tooltip"
import Link from "next/link"
import { ReactNode } from "react"
import { usePathname } from "next/navigation"

type Props = {
  href: string
  tooltip: string
  children: ReactNode
}

export default function NavbarItem({ href, tooltip, children }: Props) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <NavigationMenu.Item>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <NavigationMenu.Link
            active={isActive}
            asChild
            className={isActive ? "text-theme-300" : ""}
          >
            <Link
              href={href}
              className="flex h-8 w-8 items-center justify-center"
            >
              {children}
              <Tooltip.Portal>
                <Tooltip.Content sideOffset={5} side="right">
                  <Tooltip.Arrow className=" fill-theme-300" />
                  <div className="rounded bg-theme-300 px-4 py-2 text-center text-theme-700">
                    {tooltip}
                  </div>
                </Tooltip.Content>
              </Tooltip.Portal>
            </Link>
          </NavigationMenu.Link>
        </Tooltip.Trigger>
      </Tooltip.Root>
    </NavigationMenu.Item>
  )
}
