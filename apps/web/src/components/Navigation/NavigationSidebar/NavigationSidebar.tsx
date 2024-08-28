import { routes } from "~/lib/routes"
import { hints } from "~/lib/headers/server"
import { Auth } from "~/components/Auth"
import NavLink from "~/components/NavLink"
import Icon from "~/components/Icon"

import NavigationSidebarTooltip from "./NavigationSidebarTooltip"

export default function NavigationSidebar() {
  const { saveData } = hints()

  return (
    <nav
      aria-label="Main Navigation"
      className="fixed inset-y-0 left-0 hidden w-16 place-items-center gap-y-4 bg-arpeggio-black-900/75 px-1 py-2 backdrop-blur-1 sm:grid"
    >
      <ul>
        <NavigationSidebarTooltip label="Your profile">
          <Auth.Trigger className="group block size-14 p-1 text-theme-800 hover:text-theme-800 aria-[current='page']:text-theme-300">
            <span className="grid size-12 place-items-center rounded-2 group-hover:bg-theme-300 group-aria-[current='page']:group-hover:text-theme-800">
              <Icon
                src="Face"
                alt="Your profile"
                className="size-6 text-current"
              />
            </span>
          </Auth.Trigger>
        </NavigationSidebarTooltip>
        {routes.map((route) => (
          <NavigationSidebarTooltip
            key={route.href}
            label={route.label}
            disabled={route.disabled}
          >
            <NavLink
              className="group block size-14 p-1 text-theme-800 hover:text-theme-800 aria-[current='page']:text-theme-300"
              prefetch={!saveData}
              href={route.href}
              end={route.end}
            >
              <span className="grid size-12 place-items-center rounded-2 group-hover:bg-theme-300 group-aria-[current='page']:group-hover:text-theme-800">
                <Icon
                  src={route.icon}
                  alt={route.label}
                  className="size-6 text-current"
                />
              </span>
            </NavLink>
          </NavigationSidebarTooltip>
        ))}
      </ul>
    </nav>
  )
}
