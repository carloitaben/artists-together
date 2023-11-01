import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import * as Tooltip from "@radix-ui/react-tooltip"
import { Link } from "@remix-run/react"
import { usePageHandle } from "~/lib/handle"
import { routes } from "~/lib/routes"

export default function RailAppBar() {
  const handle = usePageHandle<{ page: { name: string } }>()

  return (
    <Tooltip.Provider delayDuration={0}>
      <NavigationMenu.Root
        orientation="vertical"
        className="fixed inset-y-0 left-0 hidden w-1/6 bg-theme-800 text-theme-50 sm:flex flex-col justify-start"
      >
        <h1 className="text-theme-100 font-serif text-base font-semibold [writing-mode:vertical-lr] rotate-180">
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
                    <Link to={route.href}>{route.label}</Link>
                  </NavigationMenu.Link>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content>{route.label}</Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </NavigationMenu.Item>
          ))}
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </Tooltip.Provider>
  )
}
