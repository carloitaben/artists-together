import { getSession } from "~/services/auth"

import * as NavigationMenu from "~/components/NavigationMenu"
import * as RadixTooltip from "~/components/Tooltip"
import NavigationTooltip from "./NavigationTooltip"
import NavigationItem from "./NavigationItem"
import NavigationLink from "./NavigationLink"
import Auth from "~/components/Auth"
import Profile from "~/components/Profile"
import {
  artists,
  calendar,
  help,
  home,
  profile,
  train,
} from "~/components/Icons"

export default async function NavigationSideBar() {
  const session = await getSession()

  return (
    <RadixTooltip.Provider>
      <NavigationMenu.Root
        orientation="vertical"
        className="fixed inset-y-0 left-0 hidden w-16 items-center justify-center overflow-y-auto bg-theme-900 text-theme-50 sm:flex"
      >
        <NavigationMenu.List className="my-4 flex flex-col gap-6">
          <NavigationTooltip label={session ? "Your profile" : "Log-in"}>
            <li>
              {session ? (
                <Profile>
                  <NavigationItem>
                    {session.user.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={session.user.avatar}
                        alt={session.user.username}
                        className="h-full w-full object-cover"
                        draggable={false}
                        decoding="async"
                        loading="lazy"
                      />
                    ) : (
                      profile
                    )}
                  </NavigationItem>
                </Profile>
              ) : (
                <Auth>
                  <NavigationItem>{profile}</NavigationItem>
                </Auth>
              )}
            </li>
          </NavigationTooltip>
          <NavigationTooltip label="Home">
            <NavigationLink href="/">
              <NavigationItem>{home}</NavigationItem>
            </NavigationLink>
          </NavigationTooltip>
          <NavigationTooltip label="About">
            <NavigationLink href="/about">
              <NavigationItem>{help}</NavigationItem>
            </NavigationLink>
          </NavigationTooltip>
          <NavigationTooltip label="Coming soon!">
            <li>
              <NavigationItem disabled>{artists}</NavigationItem>
            </li>
          </NavigationTooltip>
          <NavigationTooltip label="Coming soon!">
            <li>
              <NavigationItem disabled>{train}</NavigationItem>
            </li>
          </NavigationTooltip>
          <NavigationTooltip label="Coming soon!">
            <li>
              <NavigationItem disabled>{calendar}</NavigationItem>
            </li>
          </NavigationTooltip>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </RadixTooltip.Provider>
  )
}
