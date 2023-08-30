"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"
import * as NavigationMenu from "~/components/NavigationMenu"
import * as Tooltip from "~/components/Tooltip"
import NavigationItemTooltip from "./NavigationItemTooltip"

type Props = {
  children: ReactNode
  label: string
  href?: string
  disabled?: boolean
}

export default function NavigationItem({
  children,
  disabled,
  label,
  href,
}: Props) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <NavigationMenu.Item aria-disabled={disabled}>
      <Tooltip.ControlledRoot disableHoverableContent>
        <Tooltip.Trigger asChild>
          {href && !disabled ? (
            <NavigationMenu.Link
              asChild
              href={href}
              active={isActive}
              aria-disabled={disabled}
              className="group"
            >
              <Link href={href} className="block h-12 w-12 p-2">
                {children}
              </Link>
            </NavigationMenu.Link>
          ) : (
            children
          )}
        </Tooltip.Trigger>
        <NavigationItemTooltip>{label}</NavigationItemTooltip>
      </Tooltip.ControlledRoot>
    </NavigationMenu.Item>
  )
}
