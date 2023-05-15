"use client"

import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import * as Tooltip from "@radix-ui/react-tooltip"
import Link from "next/link"
import { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { artists, calendar, help, home, profile, train } from "./icons"

type Props = {
  href: string
  tooltip: string
  children: ReactNode
}

function NavbarItem({ href, tooltip, children }: Props) {
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

export default function Navbar() {
  return (
    <Tooltip.Provider>
      <NavigationMenu.Root
        orientation="vertical"
        className="w-16 bg-[#011B23] text-[#024456] flex items-center justify-center overflow-y-auto"
      >
        <NavigationMenu.List className="flex flex-col gap-6 my-4">
          <NavbarItem href="/profile" tooltip="Coming soon!">
            {profile}
          </NavbarItem>
          <NavbarItem href="/" tooltip="Home">
            {home}
          </NavbarItem>
          <NavbarItem href="/help" tooltip="Coming soon!">
            {help}
          </NavbarItem>
          <NavbarItem href="/artists" tooltip="Coming soon!">
            {artists}
          </NavbarItem>
          <NavbarItem href="/art" tooltip="Coming soon!">
            {train}
          </NavbarItem>
          <NavbarItem href="/calendar" tooltip="Coming soon!">
            {calendar}
          </NavbarItem>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </Tooltip.Provider>
  )
}
