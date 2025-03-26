"use client"

import { Tooltip } from "@ark-ui/react/tooltip"
import { cx } from "cva"
import type { Transition } from "motion/react"
import { mix,motion } from "motion/react"
import type { ReactNode } from "react"
import { useState, useTransition } from "react"
import { CursorPrecision } from "~/components/Cursors"

let sign = 1

const angle = mix(5, 15)

const transition: Transition = {
  type: "spring",
  mass: 0.75,
  damping: 15,
  stiffness: 1500,
}

type Props = {
  id: string
  children: ReactNode
  disabled?: boolean
  label: string
}

export default function NavigationSidebarTooltip({
  id,
  children,
  disabled,
  label,
}: Props) {
  const [, startTransition] = useTransition()
  const [rotate, setRotate] = useState(angle(Math.random()))

  return (
    <Tooltip.Root
      lazyMount
      unmountOnExit
      openDelay={0}
      closeDelay={0}
      closeOnEscape={false}
      interactive={false}
      onOpenChange={(details) => {
        if (!details.open) {
          startTransition(() => {
            sign *= -1
            setRotate(angle(Math.random()) * sign)
          })
        }
      }}
      positioning={{
        placement: "right",
      }}
    >
      <CursorPrecision id={id} asChild>
        <li>
          <Tooltip.Trigger
            asChild
            className={cx("pressable", disabled && "cursor-not-allowed")}
          >
            {children}
          </Tooltip.Trigger>
          <Tooltip.Positioner>
            <Tooltip.Content>
              <motion.div
                animate={{ rotate }}
                transition={transition}
                className="ml-1 flex origin-left transform select-none whitespace-nowrap font-semibold text-theme-800 drop-shadow-button"
              >
                <svg
                  className="fill-theme-300"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="38"
                  aria-hidden
                  focusable={false}
                >
                  <path d="M18.455 0H20v38h-1.482a4 4 0 0 1-2.96-1.31L1.533 21.261a4 4 0 0 1 .072-5.458l13.962-14.57A4 4 0 0 1 18.455 0Z" />
                </svg>
                <div className="-ml-px grid place-items-center rounded-r-1 bg-theme-300 py-2 pl-0.5 pr-3 text-center">
                  {disabled ? "Coming soon!" : label}
                </div>
              </motion.div>
            </Tooltip.Content>
          </Tooltip.Positioner>
        </li>
      </CursorPrecision>
    </Tooltip.Root>
  )
}
