"use client"

import { Menu } from "@ark-ui/react/menu"
import { cx } from "cva"
import type { MotionValue, Transition } from "motion/react"
import { AnimatePresence, motion } from "motion/react"
import type { Dispatch, SetStateAction } from "react"
import Icon from "~/components/Icon"
import { spring } from "../lib"
import NavigationBottombarMenuContent from "./NavigationBottombarMenuContent"

type Props = {
  label: string
  searchbarFocus: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
  minWidth: MotionValue<number>
}

const transition: Transition = {
  type: "spring",
  duration: 0.4,
}

export default function NavigationBottombarMenu({
  label,
  searchbarFocus,
  onOpenChange,
  minWidth,
}: Props) {
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
                  className="px-4"
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
                  style={{
                    minWidth,
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
      <NavigationBottombarMenuContent />
    </Menu.Root>
  )
}
