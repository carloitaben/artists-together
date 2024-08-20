import { Dialog, Portal } from "@ark-ui/react"
import type { ReactNode } from "react"
import { AuthContext, authenticate } from "~/services/auth/server"
import AuthModal from "./AuthModal"
import AuthLogin from "./AuthLogin"
import Profile from "./Profile"

type Props = {
  children: ReactNode
}

export default async function Auth({ children }: Props) {
  const auth = await authenticate()

  return (
    <AuthContext>
      <AuthModal>
        {children}
        <Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-arpeggio-black-900/25 backdrop-blur-xl" />
          <Dialog.Positioner className="fixed inset-0 grid size-full scroll-p-1 place-items-center overflow-y-auto p-1 sm:scroll-p-12 sm:p-12">
            {auth ? <Profile /> : <AuthLogin />}
          </Dialog.Positioner>
        </Portal>
      </AuthModal>
    </AuthContext>
  )
}
