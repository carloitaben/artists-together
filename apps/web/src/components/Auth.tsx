"use client"

import * as Dialog from "@radix-ui/react-dialog"
import * as Tabs from "@radix-ui/react-tabs"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { profile, register } from "./Icons"
import Icon from "./Icon"
import OtpTestForm from "./OtpTestForm"

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
              {emailToVerify ? (
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-3xl bg-white"
                >
                  <OtpTestForm />
                </motion.div>
              ) : (
                <Tabs.Root
                  orientation="vertical"
                  defaultValue="login"
                  className="relative"
                >
                  <Tabs.List className="absolute -left-4 top-0 grid w-56 -translate-x-full gap-2">
                    <Tabs.Trigger
                      className="flex items-center gap-x-2 rounded-full bg-gunpla-white-50 p-3 text-sm text-gunpla-white-300 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)] radix-state-active:text-gunpla-white-500"
                      value="login"
                    >
                      <Icon className="h-6 w-6" label="Log-in">
                        {profile}
                      </Icon>
                      <span>Log-in</span>
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      className="flex items-center gap-x-2 rounded-full bg-gunpla-white-50 p-3 text-sm text-gunpla-white-300 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)] radix-state-active:text-gunpla-white-500"
                      value="register"
                    >
                      <Icon className="h-6 w-6" label="Register">
                        {register}
                      </Icon>
                      <span>Register</span>
                    </Tabs.Trigger>
                  </Tabs.List>
                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Tabs.Content value="login">
                      <form
                        method="post"
                        action="/api/auth/login"
                        className="flex flex-col gap-4"
                        onSubmit={async (event) => {
                          event.preventDefault()

                          await fetch("/api/auth/magic", {
                            method: "POST",
                            headers: {
                              Accept: "application/json",
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              email: "hola.carlodominguez@gmail.com",
                            }),
                          })

                          setEmailToVerify("hola.carlodominguez@gmail.com")
                        }}
                      >
                        <div className="w-[36rem] rounded-3xl bg-gunpla-white-50 pb-12 pt-10 shadow-[0px_4px_16px_0px_rgba(11,14,30,0.08)]">
                          <div className="px-[3.75rem] pb-5">
                            <Dialog.Title className="font-serif text-[2rem] font-light text-gunpla-white-500">
                              Log-in
                            </Dialog.Title>
                          </div>
                          <div className="px-12">
                            <label className="flex flex-col">
                              <span className="mb-1 px-3 font-sans text-sm text-gunpla-white-500">
                                Email address
                              </span>
                              <input
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                className="rounded-[1rem] bg-white px-3.5 py-3 font-sans text-sm text-gunpla-white-700 placeholder:text-gunpla-white-300"
                              />
                            </label>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button className="rounded-full bg-gunpla-white-50 px-10 py-3 text-center font-sans text-sm text-gunpla-white-500 shadow-[0px_4px_16px_0px_rgba(11,14,30,0.08)] disabled:text-gunpla-white-300">
                            Log-in
                          </button>
                        </div>
                      </form>
                    </Tabs.Content>
                    <Tabs.Content value="register">
                      <Dialog.Title>Register</Dialog.Title>
                      <form method="post" action="/api/auth/signup">
                        <input
                          type="text"
                          name="username"
                          placeholder="@username"
                        />
                        <input
                          type="email"
                          name="email"
                          placeholder="Enter your email account"
                        />
                        <button type="submit">sign up</button>
                      </form>
                    </Tabs.Content>
                  </motion.div>
                </Tabs.Root>
              )}
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  )
}
