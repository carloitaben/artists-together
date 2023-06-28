"use client"

import * as Dialog from "@radix-ui/react-dialog"
import * as Tabs from "@radix-ui/react-tabs"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

export default function Auth() {
  const [open, setOpen] = useState(false)
  const [emailToVerify, setEmailToVerify] = useState<string>()

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>:)</Dialog.Trigger>
      <AnimatePresence initial={false}>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay forceMount asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-arpeggio-black-900/25 backdrop-blur-[24px]"
              />
            </Dialog.Overlay>
            <Dialog.Content
              forceMount
              className="fixed inset-0 flex items-center justify-center"
            >
              <Tabs.Root orientation="vertical" defaultValue="login">
                <Tabs.List>
                  <Tabs.Trigger
                    className="h-12 rounded-full bg-white"
                    value="login"
                  >
                    Log-in
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    className="h-12 rounded-full bg-white"
                    value="register"
                  >
                    Register
                  </Tabs.Trigger>
                </Tabs.List>
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-3xl bg-white"
                >
                  <Tabs.Content value="login">
                    <Dialog.Title>Log-in</Dialog.Title>
                  </Tabs.Content>
                  <Tabs.Content value="register">
                    <Dialog.Title>Register</Dialog.Title>
                  </Tabs.Content>
                </motion.div>
              </Tabs.Root>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  )
}
