import { getSession } from "~/services/auth"

import * as Tooltip from "~/components/Tooltip"
import * as Auth from "~/components/Auth"
import * as NavigationMenu from "~/components/NavigationMenu"
import NavigationItem from "./NavigationItem"
import Profile from "~/components/Profile"
import Icon from "~/components/Icon"

export default async function NavigationSidebar() {
  const session = await getSession()
  const hasSession = !!session

  return (
    <Tooltip.Provider delayDuration={0}>
      <NavigationMenu.Root
        orientation="vertical"
        className="fixed inset-y-0 left-0 hidden w-16 items-center justify-center overflow-y-auto bg-theme-900 text-theme-50 sm:flex"
      >
        <NavigationMenu.List className="grid place-items-center gap-2">
          <Auth.Root>
            <NavigationItem label={hasSession ? "Your profile" : "Log-in"}>
              <NavigationMenu.Trigger asChild>
                <Auth.Trigger className="group block h-12 w-12 p-2">
                  <Icon
                    className="group-group-aria-disabled:text-theme-700 h-8 w-8 text-theme-50 group-[[aria-current='page']]:text-theme-300"
                    label={hasSession ? "Your profile" : "Log-in"}
                    icon="profile"
                  />
                </Auth.Trigger>
              </NavigationMenu.Trigger>
            </NavigationItem>
            {hasSession ? <Profile /> : <Auth.Content />}
          </Auth.Root>
          <NavigationItem label="Home" href="/">
            <Icon
              className="h-8 w-8 text-theme-50 group-[[aria-current='page']]:text-theme-300 group-aria-disabled:text-theme-700"
              label="Home"
              icon="home"
            />
          </NavigationItem>
          <NavigationItem label="About" href="/about">
            <Icon
              className="h-8 w-8 text-theme-50 group-[[aria-current='page']]:text-theme-300 group-aria-disabled:text-theme-700"
              label="About"
              icon="help"
            />
          </NavigationItem>
          <NavigationItem label="Coming soon!" disabled>
            <span aria-disabled className="group block h-12 w-12 p-2">
              <Icon
                className="h-8 w-8 text-theme-50 group-[[aria-current='page']]:text-theme-300 group-aria-disabled:text-theme-700"
                label="Coming soon!"
                icon="artists"
              />
            </span>
          </NavigationItem>
          <NavigationItem label="Coming soon!" disabled>
            <span aria-disabled className="group block h-12 w-12 p-2">
              <Icon
                className="h-8 w-8 text-theme-50 group-[[aria-current='page']]:text-theme-300 group-aria-disabled:text-theme-700"
                label="Coming soon!"
                icon="train"
              />
            </span>
          </NavigationItem>
          <NavigationItem label="Coming soon!" disabled>
            <span aria-disabled className="group block h-12 w-12 p-2">
              <Icon
                className="h-8 w-8 text-theme-50 group-[[aria-current='page']]:text-theme-300 group-aria-disabled:text-theme-700"
                label="Coming soon!"
                icon="calendar"
              />
            </span>
          </NavigationItem>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </Tooltip.Provider>
  )
}
