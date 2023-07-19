"use client"

import { useEffect, useState } from "react"
import { DialogTriggerProps } from "@radix-ui/react-dialog"

import * as Modal from "~/components/Modal"
import { profile, register } from "~/components/Icons"

import Login from "./Login"
import Register from "./Register"
import Verify from "./Verify"

type Props = DialogTriggerProps

export default function Auth({ children, ...props }: Props) {
  const [open, setOpen] = useState(false)
  const [emailToVerify, setEmailToVerify] = useState<string>()

  useEffect(() => {
    if (!open && emailToVerify) {
      setEmailToVerify(undefined)
    }
  }, [emailToVerify, open])

  return (
    <Modal.Root open={open} onOpenChange={setOpen}>
      <Modal.Trigger {...props}>{children}</Modal.Trigger>
      <Modal.Portal>
        {emailToVerify ? (
          <Modal.Content>
            <Verify onSuccess={() => setOpen(false)} email={emailToVerify} />
          </Modal.Content>
        ) : (
          <>
            <Modal.Tabs>
              <Modal.Tab icon={profile} value="login">
                Log-in
              </Modal.Tab>
              <Modal.Tab icon={register} value="register">
                Register
              </Modal.Tab>
            </Modal.Tabs>
            <Modal.Content value="login">
              <Login onSuccess={(email) => setEmailToVerify(email)} />
            </Modal.Content>
            <Modal.Content value="register">
              <Register onSuccess={(email) => setEmailToVerify(email)} />
            </Modal.Content>
          </>
        )}
      </Modal.Portal>
    </Modal.Root>
  )
}
