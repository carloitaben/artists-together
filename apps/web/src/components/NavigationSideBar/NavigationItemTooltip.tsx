"use client"

import { motion, AnimatePresence } from "framer-motion"
import { between, oneOf } from "~/lib/utils"
import * as Tooltip from "~/components/Tooltip"

function getRotation() {
  return oneOf([between(-15, -5), between(5, 15)])
}

export default function NavigationItemTooltip({
  children,
  ...props
}: Omit<Tooltip.TooltipContentProps, "side" | "sideOffset" | "asChild">) {
  const [open] = Tooltip.useControlledTooltip()

  return (
    <AnimatePresence>
      {open ? (
        <Tooltip.Portal forceMount>
          <Tooltip.Content {...props} side="right" sideOffset={5} asChild>
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: getRotation() }}
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
                {children}
              </div>
            </motion.div>
          </Tooltip.Content>
        </Tooltip.Portal>
      ) : null}
    </AnimatePresence>
  )
}
