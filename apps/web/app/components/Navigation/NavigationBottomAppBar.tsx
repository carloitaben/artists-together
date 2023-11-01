import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { NavLink } from "@remix-run/react"
import { cx } from "cva"
import type { Transition } from "framer-motion"
import { AnimatePresence, motion } from "framer-motion"
import { usePageHandle } from "~/lib/handle"
import { routes } from "~/lib/routes"
import Icon from "~/components/Icon"
import { useState } from "react"

const transition: Transition = {
  type: "spring",
  bounce: 0.25,
}

export default function BottomAppBar() {
  const [focus, setFocus] = useState(false)

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
      <NavigationMenu.List className="flex items-center justify-center gap-2">
        <NavigationMenu.Item asChild>
          <NavigationMenu.Trigger asChild>
            <motion.button
              layout
              className={cx(
                "bg-theme-800 text-theme-50 h-12",
                focus ? "w-12 flex-none" : "flex-1 w-full",
              )}
              style={{ borderRadius: 16 }}
              transition={transition}
            >
              <motion.div
                layout="position"
                className="flex justify-start"
                transition={transition}
              >
                <AnimatePresence mode="wait">
                  {focus ? (
                    <motion.div
                      key="menu-icon"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                    >
                      <Icon name="menu" label="Menu" className="w-6 h-6 m-3" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu-name"
                      className="text-start px-4 whitespace-nowrap"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                    >
                      {handle.page.name}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              <NavigationMenu.Content>
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
        <NavigationMenu.Viewport className="absolute top-0 inset-x-0 max-w-[14.25rem] w-full -translate-y-full" />
        <NavigationMenu.Item asChild>
          <motion.input
            layout
            type="text"
            className={cx(
              "h-12 focus:outline-none",
              focus
                ? "flex-1 w-full bg-theme-50 text-theme-800"
                : "w-12 flex-none bg-theme-800 text-theme-50 placeholder-theme-50",
            )}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            style={{ borderRadius: 16 }}
            transition={transition}
          />
        </NavigationMenu.Item>
        <AnimatePresence mode="popLayout">
          {showMenu ? (
            <NavigationMenu.Item asChild>
              <motion.div
                className="bg-theme-800 text-theme-50 rounded-2xl flex-none flex items-center justify-center overflow-hidden w-12 h-12"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
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
