"use client"

import { AnimatePresence, Transition, motion } from "framer-motion"

import { useOnMatchScreen } from "~/hooks/media"

import {
  artists,
  calendar,
  help,
  home,
  logo,
  profile,
  train,
} from "~/components/Icons"
import { useControlledDialog } from "~/components/Dialog"
import * as Dialog from "~/components/Dialog"
import Icon from "~/components/Icon"

import NavigationLink from "./NavigationLink"
import NavigationItem from "./NavigationItem"

const transition: Transition = {
  type: "spring",
  mass: 0.05,
}

export default function NavigationMenu() {
  const [open, setOpen] = useControlledDialog()

  useOnMatchScreen("sm", (matches) => {
    if (matches && open) setOpen(false)
  })

  return (
    <AnimatePresence initial={false} mode="wait">
      {open ? (
        <Dialog.Portal forceMount>
          <Dialog.Overlay forceMount asChild>
            <motion.div
              className="fixed inset-0 bg-arpeggio-black-900/25 backdrop-blur-[24px] sm:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition}
            />
          </Dialog.Overlay>
          <Dialog.Content forceMount asChild>
            <motion.div
              className="fixed inset-y-0 left-0 w-full max-w-[19.5rem] pr-4 focus:outline-none sm:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "-100%" }}
              transition={transition}
            >
              <ul className="flex h-full w-full flex-col rounded-r-3xl bg-theme-900 py-3 text-gunpla-white-50">
                <li className="flex-1 p-14">
                  <NavigationLink href="/" onClick={() => setOpen(false)}>
                    <Icon
                      className="h-full w-full rounded-3xl p-2 group-focus-visible:ring-4"
                      label="Artist Together"
                    >
                      {logo}
                    </Icon>
                  </NavigationLink>
                </li>
                <li>
                  <NavigationItem disabled label="Coming soon!">
                    {profile}
                  </NavigationItem>
                </li>
                <li>
                  <NavigationLink href="/" onClick={() => setOpen(false)}>
                    <NavigationItem label="Home">{home}</NavigationItem>
                  </NavigationLink>
                </li>
                <li>
                  <NavigationLink href="/about" onClick={() => setOpen(false)}>
                    <NavigationItem label="About">{help}</NavigationItem>
                  </NavigationLink>
                </li>
                <li>
                  <NavigationItem disabled label="Coming soon!">
                    {artists}
                  </NavigationItem>
                </li>
                <li>
                  <NavigationItem disabled label="Coming soon!">
                    {train}
                  </NavigationItem>
                </li>
                <li>
                  <NavigationItem disabled label="Coming soon!">
                    {calendar}
                  </NavigationItem>
                </li>
              </ul>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      ) : null}
    </AnimatePresence>
  )
}
