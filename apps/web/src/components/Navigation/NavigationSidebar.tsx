import { Dialog } from "@ark-ui/react"
import { authenticate } from "~/services/auth/server"
import Avatar from "~/components/Avatar"
import Icon from "~/components//Icon"
import NavLink from "~/components//NavLink"
import NavigationSidebarItem from "./NavigationSidebarItem"
import { routes } from "./lib/routes"
import NavigationSidebarTooltip from "./NavigationSidebarTooltip"

export default async function NavigationSidebar() {
  const auth = await authenticate()

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-y-0 left-0 isolate hidden w-16 flex-col items-center justify-center gap-y-4 overflow-y-auto bg-arpeggio-black-900/25 pb-2 pt-4 backdrop-blur-xl sm:flex"
    >
      <ul className="grid place-items-center">
        <li>
          <Dialog.Trigger className="group grid size-14 place-items-center">
            <NavigationSidebarItem>
              <span className="inline-block size-6 text-current">
                {auth ? (
                  <Avatar
                    src={auth.user.avatar}
                    username={auth.user.username}
                    className="size-full"
                  />
                ) : (
                  <Icon name="face" alt="" className="size-full" />
                )}
              </span>
            </NavigationSidebarItem>
          </Dialog.Trigger>
        </li>
        {routes.map((route) => (
          <li key={route.href}>
            <NavigationSidebarTooltip label={route.label}>
              <NavLink
                mode="page"
                href={route.href}
                className="group grid size-14 place-items-center"
              >
                <NavigationSidebarItem>
                  <span className="inline-block">
                    <Icon
                      name={route.icon}
                      alt={route.label}
                      className="size-6 text-current"
                    />
                  </span>
                </NavigationSidebarItem>
              </NavLink>
            </NavigationSidebarTooltip>
            {/* {route.disabled ? (
              <button className="group block">
                <NavigationSidebarItem>
                  <Icon
                    name={route.icon}
                    alt={route.label}
                    className="size-6 text-current"
                  />
                </NavigationSidebarItem>
              </button>
            ) : (
              <Link href={route.href as any} className="block size-14">
                <NavigationSidebarItem>
                  <Icon
                    name={route.icon}
                    alt={route.label}
                    className="size-6 text-current"
                  />
                </NavigationSidebarItem>
              </Link>
            )} */}
          </li>
        ))}
      </ul>
    </nav>
  )
}
