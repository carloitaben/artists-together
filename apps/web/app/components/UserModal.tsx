import type { ReactNode } from "react"

import * as Modal from "./Modal"

type Props = {
  className?: string
  children: ReactNode
}

export default function UserModal({ className, children }: Props) {
  return (
    <Modal.Root>
      <Modal.Trigger className={className}>{children}</Modal.Trigger>
      <Modal.Portal>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Title />
          <Modal.Description />
          <Modal.Close />
        </Modal.Content>
      </Modal.Portal>
    </Modal.Root>
  )
}
