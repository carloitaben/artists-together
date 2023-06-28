"use client"

import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import * as Tooltip from "@radix-ui/react-tooltip"

import type { User } from "~/services/auth"

import { artists, calendar, help, home, profile, train } from "./icons"
import NavbarItem from "./NavbarItem"
import Auth from "../Auth"

type Props = {
  user: User
}

export default function Navbar({ user }: Props) {
  return (
    <Tooltip.Provider>
      <NavigationMenu.Root
        orientation="vertical"
        className="fixed inset-y-0 left-0 flex w-16 items-center justify-center overflow-y-auto bg-theme-900 text-theme-50"
      >
        <NavigationMenu.List className="my-4 flex flex-col gap-6">
          {user ? <div>user profile modal</div> : <Auth />}
          <NavbarItem
            href="/profile"
            tooltip={user ? user.username : "log in!"}
          >
            {profile}
          </NavbarItem>
          <NavbarItem href="/" tooltip="Home">
            {home}
          </NavbarItem>
          <NavbarItem href="/about" tooltip="Coming soon!">
            {help}
          </NavbarItem>
          <NavbarItem href="/lounge" tooltip="Coming soon!">
            {artists}
          </NavbarItem>
          <NavbarItem href="/art" tooltip="Coming soon!">
            {train}
          </NavbarItem>
          <NavbarItem href="/schedule" tooltip="Coming soon!">
            {calendar}
          </NavbarItem>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </Tooltip.Provider>
  )
}
