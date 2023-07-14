"use client"

import { ReactNode, createContext, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { between, oneOf } from "~/lib/utils"
import * as RadixTooltip from "~/components/Tooltip"

const labelContext = createContext<string>("")

export default function NavigationTooltip({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  const [hover, setHover] = useState(false)
  const [rotation, setRotation] = useState(
    oneOf([between(-15, -5), between(5, 15)])
  )

  function onOpenChange(open: boolean) {
    if (open) setRotation(oneOf([between(-15, -5), between(5, 15)]))
    setHover(open)
  }

  return (
    <labelContext.Provider value={label}>
      <RadixTooltip.Root
        open={hover}
        onOpenChange={onOpenChange}
        delayDuration={0}
      >
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <AnimatePresence>
          {hover ? (
            <RadixTooltip.Portal forceMount>
              <RadixTooltip.Content side="right" sideOffset={5} asChild>
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: rotation }}
                  transition={{
                    type: "spring",
                    mass: 0.75,
                    damping: 15,
                    stiffness: 1500,
                  }}
                  className="flex origin-left transform items-center drop-shadow-button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    width="16"
                    height="13"
                    className="-mr-px text-theme-300"
                  >
                    <path
                      fill="currentColor"
                      d="M16 0 1.37 4.64a1.95 1.95 0 0 0 0 3.72L16 13V0Z"
                    />
                  </svg>
                  <div className="rounded bg-theme-300 px-3 py-2.5 text-center text-sm font-semibold text-theme-900">
                    {label}
                  </div>
                </motion.div>
              </RadixTooltip.Content>
            </RadixTooltip.Portal>
          ) : null}
        </AnimatePresence>
      </RadixTooltip.Root>
    </labelContext.Provider>
  )
}
