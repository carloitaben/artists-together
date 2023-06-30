"use client"

import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import * as Tooltip from "@radix-ui/react-tooltip"

import type { User } from "~/services/auth"

import {
  artists,
  calendar,
  help,
  home,
  profile,
  train,
} from "~/components/Icons"
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
          {user ? (
            <div>
              <form method="post" action="/api/auth/logout">
                <button type="submit">log out</button>
              </form>
            </div>
          ) : (
            <Auth />
          )}
          <NavbarItem href="/profile" label={user ? user.username : "log in!"}>
            {profile}
          </NavbarItem>
          <NavbarItem href="/" label="Home">
            {home}
          </NavbarItem>
          <NavbarItem href="/about" label="Coming soon!">
            {help}
          </NavbarItem>
          <NavbarItem href="/lounge" label="Coming soon!">
            {artists}
          </NavbarItem>
          <NavbarItem href="/art" label="Coming soon!">
            {train}
          </NavbarItem>
          <NavbarItem href="/schedule" label="Coming soon!">
            {calendar}
          </NavbarItem>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </Tooltip.Provider>
  )
}
