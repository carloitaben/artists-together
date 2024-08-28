import { Menu } from "@ark-ui/react"
import { cx } from "cva"
import { AnimatePresence, motion } from "framer-motion"
import type { Dispatch, SetStateAction } from "react"
import { routes } from "~/lib/routes"
import { useRoute } from "~/lib/react/client"
import Icon from "~/components/Icon"
import NavLink from "~/components/NavLink"
import NavigationBottombarMenuItem from "./NavigationBottombarMenuItem"

type Props = {
  searchbarFocus: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
}

export default function NavigationBottombarMenu({
  searchbarFocus,
  onOpenChange,
}: Props) {
  const route = useRoute()

  return (
    <Menu.Root onOpenChange={(context) => onOpenChange(context.open)}>
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
      <Menu.Content className="fixed bottom-16 left-2 space-y-2 focus:outline-none">
        {routes.map((route) => (
          <Menu.Item key={route.href} value={route.href} asChild>
            <NavigationBottombarMenuItem asChild>
              <NavLink href={route.href} end={route.end}>
                <Icon src={route.icon} alt="" />
                <span className="truncate">{route.label}</span>
              </NavLink>
            </NavigationBottombarMenuItem>
          </Menu.Item>
        ))}
      </Menu.Content>
    </Menu.Root>
  )
}
