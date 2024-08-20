"use client"

import { between } from "@artists-together/core/utils"
import { Tooltip } from "@ark-ui/react"
import { useEffect, useState, type ReactNode } from "react"
import { motion } from "framer-motion"
import type { Transition } from "framer-motion"

const transition: Transition = {
  type: "spring",
  mass: 0.75,
  damping: 15,
  stiffness: 1500,
}

let sign = 1

type Props = {
  children: ReactNode
  disabled?: boolean
  label: string
}

export default function NavigationSidebarTooltip({
  children,
  disabled,
  label,
}: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) sign = sign * -1
  }, [open])

  return (
    <Tooltip.Root
      openDelay={0}
      closeDelay={0}
      closeOnEscape={false}
      interactive={false}
      closeOnPointerDown={false}
      onOpenChange={(details) => setOpen(details.open)}
      positioning={{ placement: "right" }}
    >
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Positioner>
        <Tooltip.Content>
          <motion.div
            className="text-arpeggio-black-800 drop-shadow-button ml-1 flex origin-left transform whitespace-nowrap font-semibold"
            initial={{ rotate: 0 }}
            animate={{ rotate: between(5, 15) * sign }}
            transition={transition}
          >
            <svg
              className="fill-arpeggio-black-300"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="38"
              aria-hidden
            >
              <path d="M18.455 0H20v38h-1.482a4 4 0 0 1-2.96-1.31L1.533 21.261a4 4 0 0 1 .072-5.458l13.962-14.57A4 4 0 0 1 18.455 0Z" />
            </svg>
            <div className="bg-arpeggio-black-300 -ml-px flex items-center rounded-r-[0.25rem] py-2 pl-0.5 pr-3">
              {disabled ? "Coming soon!" : label}
            </div>
          </motion.div>
        </Tooltip.Content>
      </Tooltip.Positioner>
    </Tooltip.Root>
  )
}
