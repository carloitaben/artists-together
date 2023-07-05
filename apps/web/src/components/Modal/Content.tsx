"use client"

import { AnimatePresence, motion } from "framer-motion"
import * as Dialog from "@radix-ui/react-dialog"

import { useRootModalContext } from "./Root"

type Props = Omit<Dialog.DialogContentProps, "forceMount">

export default function Content({ children, ...props }: Props) {
  const modal = useRootModalContext()
  return (
    <AnimatePresence initial={false} mode="wait">
      {modal.open ? (
        <Dialog.Portal forceMount>
          <Dialog.Overlay forceMount asChild>
            <motion.div className="fixed inset-0 bg-arpeggio-black-900/25 backdrop-blur-[24px]" />
          </Dialog.Overlay>
          <Dialog.Content {...props} forceMount asChild>
            <motion.div className="fixed inset-0 flex items-start justify-center overflow-y-auto px-4 pb-4 pt-[33.333vh]">
              {children}
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      ) : null}
    </AnimatePresence>
  )
}
