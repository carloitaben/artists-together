"use client"

import { DialogTriggerProps } from "@radix-ui/react-dialog"
import { useState } from "react"

import * as Modal from "~/components/Modal"
import { profile, register } from "~/components/Icons"

import Login from "../Auth2/Login"
import Register from "../Auth2/Register"
import Verify from "../Auth2/Verify"

type Props = DialogTriggerProps

export default function Auth({ children, ...props }: Props) {
  const [open, setOpen] = useState(false)
  const [emailToVerify, setEmailToVerify] = useState<string>()

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
