"use client"

import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import * as Tooltip from "@radix-ui/react-tooltip"
import Link from "next/link"
import { CSSProperties, ReactNode, useState } from "react"
import { usePathname } from "next/navigation"

import Icon from "~/components/Icon"
import { between } from "~/lib/utils"

type Props = {
  href: string
  label: string
  children: ReactNode
}

export default function NavbarItem({ href, label, children }: Props) {
  const [hover, setHover] = useState(false)
  const [rotation, setRotation] = useState(between(-5, 5))
  const pathname = usePathname()
  const isActive = pathname === href

  function onOpenChange(open: boolean) {
    if (open) setRotation(between(-5, 5))
    setHover(open)
  }

  const style = { "--tw-rotate": `${rotation}deg` } as CSSProperties

  return (
    <NavigationMenu.Item>
      <Tooltip.Root open={hover} onOpenChange={onOpenChange} delayDuration={0}>
        <Tooltip.Trigger asChild>
          <NavigationMenu.Link
            active={isActive}
            asChild
            className={isActive ? "text-theme-300" : ""}
          >
            <Link href={href}>
              <Icon label={label} className="h-8 w-8">
                {children}
              </Icon>
            </Link>
          </NavigationMenu.Link>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="flex origin-left transform items-center drop-shadow-[0px_4px_8px_0px_rgba(11,14,30,0.08)]"
            side="right"
            sideOffset={5}
            style={style}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              width="16"
              height="13"
              className="-mr-px text-theme-300"
            >
              <path
                fill="currentColor"
                d="M16 0 1.37 4.64a1.95 1.95 0 0 0 0 3.72L16 13V0Z"
              />
            </svg>
            <div className="rounded bg-theme-300 px-3 py-2.5 text-center text-sm font-semibold text-theme-900">
              {label}
            </div>
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </NavigationMenu.Item>
  )
}
