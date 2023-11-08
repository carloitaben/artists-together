import * as Dialog from "@radix-ui/react-dialog"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { NavLink } from "@remix-run/react"
import { useEffect, useRef, useState } from "react"
import type { Transition } from "framer-motion"
import { AnimatePresence, motion } from "framer-motion"
import { cx } from "cva"
import { routes } from "~/lib/routes"
import { usePageHandle } from "~/lib/handle"
import { useHints, useUser } from "~/hooks/loaders"
import Icon from "~/components/Icon"
import Image from "~/components/Image"
import NavigationBottomAppBarPill from "./NavigationBottomAppBarPill"

const transition: Transition = {
  type: "spring",
  bounce: 0.25,
}

function AuthLink() {
  const user = useUser()

  return (
    <li>
      <Dialog.Trigger asChild>
        <NavigationBottomAppBarPill
          icon={
            user?.avatar ? (
              <Image
                className="w-6 h-6 bg-current rounded-full overflow-hidden"
                src={user.avatar}
                alt="Your profile"
                width={24}
                height={24}
              />
            ) : (
              "face"
            )
          }
        >
          {user ? "Your profile" : "Sign in"}
        </NavigationBottomAppBarPill>
      </Dialog.Trigger>
    </li>
  )
}

export default function BottomAppBar() {
  const [focus, setFocus] = useState(false)
  const [menu, setMenu] = useState<string>()
  const [actionsOpened, setActionsOpened] = useState(false)
  const hints = useHints()
  const input = useRef<HTMLInputElement>(null)

  const handle = usePageHandle<{
    page: { name: string }
    actions: Record<string, any>
  }>()

  const showMenu = Object.keys(handle.actions).length
  const showOverlay = menu === "navigation" || actionsOpened

  useEffect(() => {
    if (focus && input.current) {
      input.current.focus()
    }
  }, [focus])

  return (
    <NavigationMenu.Root
      orientation="horizontal"
      className="fixed bottom-0 inset-x-0 sm:hidden p-2"
      onValueChange={setMenu}
      value={menu}
    >
      <AnimatePresence initial={false}>
        {showOverlay ? (
          <motion.div className="fixed inset-0 bg-theme-900/25 backdrop-blur-xl sm:hidden" />
        ) : null}
      </AnimatePresence>
      <NavigationMenu.List className="flex items-center justify-center gap-2">
        <NavigationMenu.Item asChild value="navigation">
          <NavigationMenu.Trigger asChild>
            <motion.button
              layout
              className={cx(
                "bg-theme-800 text-theme-50 h-12 overflow-hidden",
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
                <AnimatePresence mode="wait" initial={false}>
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
              <NavigationMenu.Content className="absolute top-0 inset-x-0 max-w-[14.25rem] w-full -translate-y-full">
                <ul className="space-y-2 mb-2">
                  <AuthLink />
                  {routes.map((route) => (
                    <li key={route.href}>
                      <NavLink
                        to={route.href}
                        prefetch={hints.saveData ? "intent" : "viewport"}
                      >
                        {({ isActive, isPending }) => (
                          <NavigationBottomAppBarPill
                            active={isActive || isPending}
                            icon={route.icon}
                          >
                            {route.label}
                          </NavigationBottomAppBarPill>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenu.Content>
            </motion.button>
          </NavigationMenu.Trigger>
        </NavigationMenu.Item>
        <NavigationMenu.Item asChild value="searchbar">
          <motion.li
            layout
            className={cx(
              "h-12 overflow-hidden relative transition-colors duration-150",
              focus
                ? "flex-1 w-full bg-theme-50 text-theme-800"
                : "w-12 flex-none bg-theme-800 text-theme-50",
            )}
            style={{ borderRadius: 16 }}
            transition={transition}
          >
            <NavigationMenu.Trigger asChild>
              <motion.button
                className="w-full h-full"
                onClick={(event) => {
                  event.preventDefault()
                  setFocus(true)
                }}
              >
                <motion.input
                  layout="position"
                  ref={input}
                  className={cx(
                    "w-full h-full p-4 bg-transparent focus:outline-none caret-theme-300",
                    focus ? "" : "pointer-events-none",
                  )}
                  placeholder="Search something"
                  disabled={!focus}
                  initial={false}
                  animate={{ opacity: focus ? 1 : 0 }}
                  onFocus={() => setFocus(true)}
                  onBlur={() => setFocus(false)}
                  transition={transition}
                />
              </motion.button>
            </NavigationMenu.Trigger>
            <motion.div
              layout="position"
              className="absolute inset-y-0 right-0 pointer-events-none"
            >
              <Icon name="search" label="Search" className="w-6 h-6 m-3" />
            </motion.div>
          </motion.li>
        </NavigationMenu.Item>
        <AnimatePresence initial={false} mode="popLayout">
          {showMenu ? (
            <NavigationMenu.Item value="actions">
              <DropdownMenu.Root
                open={actionsOpened}
                onOpenChange={setActionsOpened}
              >
                <NavigationMenu.Trigger asChild>
                  <DropdownMenu.Trigger asChild>
                    <motion.button
                      className="bg-theme-800 text-theme-50 rounded-2xl flex-none flex items-center justify-center overflow-hidden w-12 h-12 -z-10"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={transition}
                    >
                      <Icon
                        name="more"
                        label="Menu"
                        className="w-6 h-6 flex-none"
                      />
                    </motion.button>
                  </DropdownMenu.Trigger>
                </NavigationMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="absolute top-0 right-0 -translate-y-full pb-2 bg-acrylic-red-400 space-y-2"
                    side="right"
                    align="start"
                  >
                    <DropdownMenu.Item asChild>
                      <NavigationBottomAppBarPill
                        icon="home"
                        className="flex-row-reverse"
                      >
                        Foo
                      </NavigationBottomAppBarPill>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <NavigationBottomAppBarPill
                        icon="home"
                        className="flex-row-reverse"
                      >
                        Foo
                      </NavigationBottomAppBarPill>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <NavigationBottomAppBarPill
                        icon="home"
                        className="flex-row-reverse"
                      >
                        Foo
                      </NavigationBottomAppBarPill>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </NavigationMenu.Item>
          ) : null}
        </AnimatePresence>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  )
}
