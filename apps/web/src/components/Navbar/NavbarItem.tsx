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
          <NavigationMenu.Link active={isActive} asChild className={isActive ? "text-[#76F6D8]" : ""}>
            <Link href={href} className="flex items-center justify-center w-8 h-8">
              {children}
              <Tooltip.Portal>
                <Tooltip.Content sideOffset={5} side="right">
                  <Tooltip.Arrow className=" fill-[#76F6D8]" />
                  <div className="bg-[#76F6D8] text-[#0A3743] py-2 px-4 rounded text-center">{tooltip}</div>
                </Tooltip.Content>
              </Tooltip.Portal>
            </Link>
          </NavigationMenu.Link>
        </Tooltip.Trigger>
      </Tooltip.Root>
    </NavigationMenu.Item>
  )
}
