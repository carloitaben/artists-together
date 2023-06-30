"use client"

import * as Dialog from "@radix-ui/react-dialog"
import * as Tabs from "@radix-ui/react-tabs"
import { ReactNode, useState } from "react"
import { motion } from "framer-motion"
import { z } from "zod"

import { loginSchema, signupSchema } from "~/lib/schemas"

import * as Modal from "./Modal"
import * as Form from "./Form"
import { profile, register } from "./Icons"
import Icon from "./Icon"
import Verify from "./Auth/forms/Verify"

type Props = {
  children: ReactNode
}

const otpSchema = z.object({
  otp: z.string().length(6),
})

export default function Auth({ children }: Props) {
  const [emailToVerify, setEmailToVerify] = useState<string>()

  return (
    <Modal.Root>
      <Modal.Trigger>{children}</Modal.Trigger>
      <Modal.Content>
        {emailToVerify ? (
          <Verify email={emailToVerify} />
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
            <motion.div>
              <Tabs.Content value="login" asChild>
                <Form.Root
                  schema={loginSchema}
                  initialValues={{ email: "" }}
                  onSubmit={async (data) => {
                    const response = await fetch("/api/auth/login", {
                      method: "POST",
                      headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(data),
                    })

                    if (response.ok) setEmailToVerify(data.email)
                  }}
                >
                  <Form.Form>
                    <div className="w-[36rem] rounded-4xl bg-gunpla-white-50 pb-12 pt-10 shadow-[0px_4px_16px_0px_rgba(11,14,30,0.08)]">
                      <Dialog.Title className="px-[3.75rem] pb-5 font-serif text-[2rem] font-light text-gunpla-white-500">
                        Log-in
                      </Dialog.Title>
                      <Form.Field name="email" className="px-12">
                        <Form.Label>Email address</Form.Label>
                        <Form.Input
                          type="email"
                          placeholder="johndoe@email.com"
                        />
                        <Form.Error />
                      </Form.Field>
                    </div>
                    <Form.Submit className="mt-4 flex justify-end">
                      Log-in
                    </Form.Submit>
                  </Form.Form>
                </Form.Root>
              </Tabs.Content>
              <Tabs.Content value="register" asChild>
                <Form.Root
                  schema={signupSchema}
                  initialValues={{ email: "", username: "" }}
                  onSubmit={async (data, helpers) => {
                    const response = await fetch("/api/auth/register", {
                      method: "POST",
                      headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(data),
                    })

                    if (response.ok) {
                      setEmailToVerify(data.email)
                    } else if (response.status === 403) {
                      helpers.setFieldError(
                        "username",
                        "Username already exists"
                      )
                    }
                  }}
                >
                  <Form.Form>
                    <div className="w-[36rem] rounded-4xl bg-gunpla-white-50 pb-12 pt-10 shadow-[0px_4px_16px_0px_rgba(11,14,30,0.08)]">
                      <Dialog.Title className="px-[3.75rem] pb-5 font-serif text-[2rem] font-light text-gunpla-white-500">
                        Register
                      </Dialog.Title>
                      <Form.Field name="email" className="mb-4 px-12">
                        <Form.Label>Email address</Form.Label>
                        <Form.Input
                          type="email"
                          placeholder="johndoe@email.com"
                        />
                        <Form.Error />
                      </Form.Field>
                      <Form.Field name="username" className="px-12">
                        <Form.Label
                          caption={({ value }) => `${30 - value.length}/30`}
                        >
                          Username
                        </Form.Label>
                        <Form.Input
                          placeholder="johndoe"
                          icon={
                            <Form.Tooltip>
                              We recommend using the same username you have in
                              other platforms.
                            </Form.Tooltip>
                          }
                        />
                        <Form.Error />
                      </Form.Field>
                    </div>
                    <Form.Submit className="mt-4 flex justify-end">
                      Register
                    </Form.Submit>
                  </Form.Form>
                </Form.Root>
              </Tabs.Content>
            </motion.div>
          </Tabs.Root>
        )}
      </Modal.Content>
    </Modal.Root>
  )
}
