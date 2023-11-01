import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { NavLink } from "@remix-run/react"
import { cx } from "cva"
import { usePageHandle } from "~/lib/handle"
import { routes } from "~/lib/routes"
import Icon from "~/components/Icon"

export default function BottomAppBar() {
  const handle = usePageHandle<{ page: { name: string } }>()

  return (
    <NavigationMenu.Root
      orientation="horizontal"
      className="fixed bottom-0 inset-x-0 sm:hidden p-2"
    >
      <NavigationMenu.List className="flex items-center justify-center gap-1">
        <NavigationMenu.Item asChild>
          <NavigationMenu.Trigger className="flex-1 rounded-2xl bg-theme-800 text-theme-50 w-full h-full block text-start p-3">
            <span className="text-truncate">{handle.page.name}</span>
            <NavigationMenu.Content className="absolute top-0 inset-x-0 max-w-[14.25rem] w-full -translate-y-full">
              <ul className="space-y-2 mb-2">
                {routes.map((route) => (
                  <li key={route.href}>
                    <NavLink to={route.href}>
                      {({ isActive, isPending }) => (
                        <div
                          className={cx(
                            "flex rounded-2xl gap-5 p-3",
                            isActive || isPending
                              ? " bg-theme-300 text-theme-900"
                              : "bg-theme-900 text-theme-50",
                          )}
                        >
                          <Icon
                            name={route.icon}
                            label=""
                            className="w-6 h-6 flex-none"
                          />
                          <span className="truncate">{route.label}</span>
                        </div>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </NavigationMenu.Content>
          </NavigationMenu.Trigger>
        </NavigationMenu.Item>
        <NavigationMenu.Item className="w-12 h-12 bg-theme-800 text-theme-50 rounded-2xl block p-3" />
      </NavigationMenu.List>
    </NavigationMenu.Root>
  )
}
