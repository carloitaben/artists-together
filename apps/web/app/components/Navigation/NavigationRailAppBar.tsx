import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import * as Tooltip from "@radix-ui/react-tooltip"
import { cx } from "cva"
import { NavLink } from "@remix-run/react"
import { usePageHandle } from "~/lib/handle"
import { routes } from "~/lib/routes"
import Icon from "~/components/Icon"
import NavigationRailTooltip from "./NavigationRailTooltip"

export default function RailAppBar() {
  const handle = usePageHandle<{ page: { name: string } }>()

  return (
    <Tooltip.Provider delayDuration={0}>
      <NavigationMenu.Root
        orientation="vertical"
        className="fixed inset-y-0 left-0 hidden w-16 bg-theme-900 text-theme-50 sm:flex flex-col items-center justify-start overflow-y-auto gap-y-4 pt-4 pb-2"
      >
        <h1 className="text-theme-100 font-serif text-base font-semibold [writing-mode:vertical-lr] rotate-180 flex">
          {handle.page.name}
        </h1>
        <NavigationMenu.List className="grid">
          {routes.map((route) => (
            <NavigationMenu.Item
              key={route.href}
              aria-disabled={route?.disabled}
            >
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <NavigationMenu.Link
                    asChild
                    href={route.href}
                    aria-disabled={route?.disabled}
                  >
                    <NavLink to={route.href} className="group">
                      {({ isActive, isPending }) => (
                        <div
                          className={cx(
                            "w-12 h-12 flex items-center justify-center rounded-lg group-aria-disabled:text-theme-800 group-aria-disabled:hover:bg-unset",
                            {
                              "text-theme-700 hover:bg-theme-800 hover:text-theme-100":
                                !isActive && !isPending,
                              "bg-theme-300 text-theme-700":
                                isActive && !isPending,
                              "bg-theme-800 text-theme-100": isPending,
                            },
                          )}
                        >
                          <Icon
                            name={route.icon}
                            label={route.label}
                            className="w-6 h-6"
                          />
                        </div>
                      )}
                    </NavLink>
                  </NavigationMenu.Link>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <NavigationRailTooltip>
                    {route.disabled ? "Coming soon!" : route.label}
                  </NavigationRailTooltip>
                </Tooltip.Portal>
              </Tooltip.Root>
            </NavigationMenu.Item>
          ))}
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </Tooltip.Provider>
  )
}
