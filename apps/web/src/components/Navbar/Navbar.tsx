import * as NavigationMenu from "~/compat/radix-ui/react-navigation-menu"
import * as Tooltip from "~/compat/radix-ui/react-tooltip"
import { getUser } from "~/services/auth"

import NavbarItem from "./NavbarItem"
import { artists, calendar, help, home, profile, train } from "./icons"

export default async function Navbar() {
  const user = await getUser()

  return (
    <Tooltip.Provider>
      <NavigationMenu.Root
        orientation="vertical"
        className="w-16 bg-[#011B23] text-[#024456] flex items-center justify-center overflow-y-auto fixed inset-y-0 left-0"
      >
        <NavigationMenu.List className="flex flex-col gap-6 my-4">
          <NavbarItem href="/profile" tooltip={user ? user.userId : "log in!"}>
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
