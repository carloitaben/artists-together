"use client"

import * as Dialog from "@radix-ui/react-dialog"
import * as Tabs from "@radix-ui/react-tabs"
import { useState } from "react"

export default function Auth() {
  const [emailToVerify, setEmailToVerify] = useState<string>()

  return (
    <Dialog.Root>
      <Dialog.Trigger></Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-arpeggio-black/25 backdrop-blur-[24px]" />
        <div className="fixed inset-0">
          {emailToVerify ? (
            <Dialog.Content className="bg-gunpla-white-50">
              <Dialog.Title>A verification code has been sent to your email account</Dialog.Title>
              <form method="post" action="/auth/magic">
                <input type="hidden" name="email" value={emailToVerify} />
                <input type="number" name="otp" />
                <button type="button">Not received? Resend it</button>
                <button type="submit">Confirm</button>
              </form>
            </Dialog.Content>
          ) : (
            <Dialog.Content className="bg-gunpla-white-50">
              <Tabs.Root>
                <Tabs.List>
                  <Tabs.Trigger value="login">Log-in</Tabs.Trigger>
                  <Tabs.Trigger value="signup">Register</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="login">
                  <Dialog.Title>Login</Dialog.Title>
                  <form method="post" action="/auth/login">
                    <label>
                      <span>Email account</span>
                      <input type="email" name="email" />
                    </label>
                    <button type="submit">Log-in</button>
                  </form>
                </Tabs.Content>
                <Tabs.Content value="signup">
                  <Dialog.Title>Register</Dialog.Title>
                  <form method="post" action="/auth/login">
                    <label>
                      <span>Email account</span>
                      <input type="email" name="email" />
                    </label>
                    <label>
                      <span>Username</span>
                      <input type="text" name="username" />
                    </label>
                    <button type="submit">Register</button>
                  </form>
                </Tabs.Content>
              </Tabs.Root>
            </Dialog.Content>
          )}
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
