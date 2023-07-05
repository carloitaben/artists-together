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
import Auth from "~/components//Auth"

import NavbarDesktopItem from "./NavbarDesktopItem"

type Props = {
  user: User
}

export default function NavbarDesktop({ user }: Props) {
  return (
    <Tooltip.Provider>
      <NavigationMenu.Root
        orientation="vertical"
        className="fixed inset-y-0 left-0 hidden w-16 items-center justify-center overflow-y-auto bg-theme-900 text-theme-50 sm:flex"
      >
        <NavigationMenu.List className="my-4 flex flex-col gap-6">
          {user ? (
            <div>
              <form method="post" action="/api/auth/logout">
                <button type="submit">log out</button>
              </form>
            </div>
          ) : (
            <Auth>{profile}</Auth>
          )}
          <NavbarDesktopItem
            href="/profile"
            label={user ? user.username : "log in!"}
          >
            {profile}
          </NavbarDesktopItem>
          <NavbarDesktopItem href="/" label="Home">
            {home}
          </NavbarDesktopItem>
          <NavbarDesktopItem href="/about" label="Coming soon!">
            {help}
          </NavbarDesktopItem>
          <NavbarDesktopItem href="/lounge" label="Coming soon!">
            {artists}
          </NavbarDesktopItem>
          <NavbarDesktopItem href="/art" label="Coming soon!">
            {train}
          </NavbarDesktopItem>
          <NavbarDesktopItem href="/schedule" label="Coming soon!">
            {calendar}
          </NavbarDesktopItem>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </Tooltip.Provider>
  )
}
