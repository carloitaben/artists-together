import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { NavLink } from "@remix-run/react"
import { cx } from "cva"
import type { Transition } from "framer-motion"
import { AnimatePresence, motion } from "framer-motion"
import { usePageHandle } from "~/lib/handle"
import { routes } from "~/lib/routes"
import Icon from "~/components/Icon"

const transition: Transition = {
  type: "spring",
  mass: 0.015,
}

export default function BottomAppBar() {
  const handle = usePageHandle<{
    page: { name: string }
    actions: Record<string, any>
  }>()

  const showMenu = Object.keys(handle.actions).length

  return (
    <NavigationMenu.Root
      orientation="horizontal"
      className="fixed bottom-0 inset-x-0 sm:hidden p-2"
    >
      <NavigationMenu.List className="flex items-center justify-center gap-1">
        <NavigationMenu.Item asChild>
          <NavigationMenu.Trigger asChild>
            <motion.button
              layout
              className="flex-1 rounded-2xl bg-theme-800 text-theme-50 block text-start p-3 w-full h-12"
              transition={transition}
            >
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
            </motion.button>
          </NavigationMenu.Trigger>
        </NavigationMenu.Item>
        <AnimatePresence>
          {showMenu ? (
            <NavigationMenu.Item asChild>
              <motion.div
                className="bg-theme-800 text-theme-50 rounded-2xl flex-none flex items-center justify-center overflow-hidden"
                initial={{ scale: 0, width: "0rem", height: "0rem" }}
                animate={{ scale: 1, width: "3rem", height: "3rem" }}
                exit={{ scale: 0, width: "0rem", height: "0rem" }}
                transition={transition}
              >
                <Icon name="more" label="Menu" className="w-6 h-6 flex-none" />
              </motion.div>
            </NavigationMenu.Item>
          ) : null}
        </AnimatePresence>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  )
}
