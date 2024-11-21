import { useSuspenseQueries } from "@tanstack/react-query"
import { Menu } from "@ark-ui/react/menu"
import { cx } from "cva"
import type { Transition } from "motion/react"
import { AnimatePresence, motion } from "motion/react"
import type { Dispatch, SetStateAction } from "react"
import { authenticateQueryOptions } from "~/services/auth/queries"
import { hintsQueryOptions } from "~/services/hints/queries"
import { navigationEntries } from "~/lib/navigation"
import Icon from "~/components/Icon"
import NavLink from "~/components/NavLink"
import NavigationBottombarMenuItem from "./NavigationBottombarMenuItem"
import { spring } from "../lib"
import Avatar from "~/components/Avatar"

type Props = {
  label: string
  searchbarFocus: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
}

const transition: Transition = {
  type: "spring",
  duration: 0.4,
}

export default function NavigationBottombarMenu({
  label,
  searchbarFocus,
  onOpenChange,
}: Props) {
  const [auth, hints] = useSuspenseQueries({
    queries: [authenticateQueryOptions, hintsQueryOptions],
  })

  return (
    <Menu.Root onOpenChange={(context) => onOpenChange(context.open)}>
      <Menu.Trigger asChild>
        <motion.button
          layout
          className={cx(
            searchbarFocus ? "w-12 flex-none" : "flex-1",
            "overflow-hidden bg-arpeggio-black-800 text-gunpla-white-50 [text-align:unset]",
          )}
          transition={spring}
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
                  transition={transition}
                  variants={{
                    hide: {
                      scale: 0,
                      opacity: 0,
                      filter: "blur(8px)",
                    },
                    show: {
                      scale: 1,
                      opacity: 1,
                      filter: "blur(0px)",
                    },
                  }}
                >
                  <Icon src="Menu" alt="Menu" className="size-6" />
                </motion.div>
              ) : (
                <motion.div
                  key={label}
                  className="min-w-[--min-w] px-4"
                  initial="hide"
                  animate="show"
                  exit="hide"
                  transition={transition}
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
                    transition={transition}
                    variants={{
                      hide: {
                        scale: 0.3,
                        filter: "blur(8px)",
                      },
                      show: {
                        scale: 1,
                        filter: "blur(0px)",
                      },
                    }}
                  >
                    {label}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.button>
      </Menu.Trigger>
      <Menu.Content className="fixed bottom-16 left-2 space-y-2 focus:outline-none">
        <Menu.Item value="auth" asChild>
          <NavigationBottombarMenuItem asChild>
            <NavLink
              to="."
              replace
              search={(prev) => ({ ...prev, modal: "auth" })}
            >
              {auth.data ? (
                <Avatar
                  username={auth.data.user.username}
                  src={auth.data.user.avatar}
                />
              ) : (
                <Icon src="Face" alt="Log-in" />
              )}
              <span className="truncate">
                {auth.data ? "Your profile" : "Log-in"}
              </span>
            </NavLink>
          </NavigationBottombarMenuItem>
        </Menu.Item>
        {navigationEntries.map(([key, route]) => (
          <Menu.Item
            key={key}
            value={route.link.to}
            disabled={route.disabled}
            asChild
          >
            <NavigationBottombarMenuItem disabled={route.disabled} asChild>
              <NavLink
                {...route.link}
                disabled={route.disabled}
                preload={hints.data.saveData ? "intent" : "render"}
              >
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
