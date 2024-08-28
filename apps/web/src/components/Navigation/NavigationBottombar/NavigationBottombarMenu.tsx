import { Menu } from "@ark-ui/react"
import { cx } from "cva"
import { AnimatePresence, motion } from "framer-motion"
import Icon from "~/components/Icon"
import NavLink from "~/components/NavLink"
import { routes } from "../lib"
import NavigationBottombarMenuItem from "./NavigationBottombarMenuItem"
import { usePathname } from "next/navigation"

type Props = {
  searchbarFocus: boolean
}

export default function NavigationBottombarMenu({ searchbarFocus }: Props) {
  const pathname = usePathname()
  const route = routes.find((route) => route.href === pathname)

  if (!route) {
    throw Error("TODO: handle this")
  }

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <motion.button
          layout
          className={cx(
            searchbarFocus ? "w-12 flex-none" : "flex-1",
            "overflow-hidden bg-arpeggio-black-800 text-gunpla-white-50 [text-align:unset]",
          )}
          style={{
            borderRadius: 16,
            boxShadow: "0px 4px 8px rgba(11, 14, 30, 0.08)",
          }}
        >
          <motion.div
            layout="position"
            className="flex size-full items-center whitespace-nowrap"
          >
            <AnimatePresence mode="wait" initial={false}>
              {searchbarFocus ? (
                <motion.div
                  className="m-3"
                  key="menu-icon"
                  initial="hide"
                  animate="show"
                  exit="hide"
                  variants={{
                    hide: {
                      scale: 0,
                      opacity: 0,
                    },
                    show: {
                      scale: 1,
                      opacity: 1,
                    },
                  }}
                >
                  <Icon src="Menu" alt="Menu" className="size-6" />
                </motion.div>
              ) : (
                <motion.div
                  key={route.label}
                  className="min-w-[--min-w] px-4"
                  initial="hide"
                  animate="show"
                  exit="hide"
                  variants={{
                    hide: {
                      opacity: 0,
                    },
                    show: {
                      opacity: 1,
                    },
                  }}
                >
                  <motion.div
                    className="size-full origin-left truncate"
                    initial="hide"
                    animate="show"
                    exit="hide"
                    variants={{
                      hide: {
                        scale: 0,
                      },
                      show: {
                        scale: 1,
                      },
                    }}
                  >
                    {route.label}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.button>
      </Menu.Trigger>
      <Menu.Content className="fixed bottom-16 left-2">
        {routes.map((route) => (
          <Menu.Item key={route.href} value={route.href} asChild>
            <NavLink href={route.href} end={route.end}>
              <NavigationBottombarMenuItem icon={route.icon}>
                {route.label}
              </NavigationBottombarMenuItem>
            </NavLink>
          </Menu.Item>
        ))}
      </Menu.Content>
    </Menu.Root>
  )
}
