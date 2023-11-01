import { motion } from "framer-motion"
import { forwardRef } from "react"
import type { ForwardedRef, ReactNode } from "react"
import * as Tooltip from "@radix-ui/react-tooltip"
import { between, oneOf } from "~/lib/utils"

function getRotation() {
  return oneOf([between(-15, -5), between(5, 15)])
}

type Props = {
  children: ReactNode
}

function NavigationRailTooltip(
  { children }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <Tooltip.Content ref={ref} side="right" asChild>
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: getRotation() }}
        className="ml-1 flex font-semibold text-theme-800 whitespace-nowrap drop-shadow-button origin-left transform"
        transition={{
          type: "spring",
          mass: 0.75,
          damping: 15,
          stiffness: 1500,
        }}
      >
        <svg
          className="fill-theme-300"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="38"
        >
          <path d="M18.455 0H20v38h-1.482a4 4 0 0 1-2.96-1.31L1.533 21.261a4 4 0 0 1 .072-5.458l13.962-14.57A4 4 0 0 1 18.455 0Z" />
        </svg>
        <div className="-ml-px bg-theme-300 flex items-center pr-3 py-2 rounded-r-[0.25rem]">
          {children}
        </div>
      </motion.div>
    </Tooltip.Content>
  )
}

export default forwardRef(NavigationRailTooltip)
