import { hints } from "~/lib/headers/server"
import NavLink from "~/components/NavLink"
import Icon from "~/components/Icon"
import SidebarTooltip from "./SidebarTooltip"
import { routes } from "./lib"

export default function Sidebar() {
  const { saveData } = hints()

  return (
    <nav
      aria-label="Main Navigation"
      className="fixed inset-y-0 left-0 hidden w-16 place-items-center gap-y-4 bg-arpeggio-black-900/75 px-1 py-2 backdrop-blur-1 sm:grid"
    >
      <ul>
        {routes.map((route) => (
          <SidebarTooltip
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
          </SidebarTooltip>
        ))}
      </ul>
    </nav>
  )
}
