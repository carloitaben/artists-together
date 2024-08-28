import { Dialog } from "@ark-ui/react"
import type { ReactNode } from "react"
import { authenticate } from "~/services/auth/server"
import Scrim from "~/components/Scrim"
import Root from "./Root"
import Profile from "./Profile"
import Login from "./Login"

type Props = {
  children: ReactNode
}

export default async function Auth({ children }: Props) {
  const auth = await authenticate()

  return (
    <Root>
      {children}
      <Dialog.Backdrop asChild>
        <Scrim className="z-50" />
      </Dialog.Backdrop>
      <Dialog.Positioner className="fixed inset-0 z-50 grid size-full scroll-p-1 place-items-center overflow-y-auto p-1 sm:scroll-p-12 sm:p-12">
        {auth ? <Profile /> : <Login />}
      </Dialog.Positioner>
    </Root>
  )
}
