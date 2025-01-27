import { Dialog } from "@ark-ui/react/dialog"
import { cx } from "cva"
import { getAuth } from "~/services/auth/server"
import Backdrop from "~/components/Backdrop"
import AuthRoot from "./AuthRoot"
import Profile from "./Profile"
import Login from "./Login"

export default async function Auth() {
  const auth = await getAuth()

  return (
    <AuthRoot>
      <Dialog.Backdrop asChild>
        <Backdrop className="z-50" />
      </Dialog.Backdrop>
      <Dialog.Positioner
        className={cx(
          "fixed inset-0 z-50 grid size-full place-items-center overflow-y-auto",
          "scroll-px-1 scroll-pb-4 scroll-pt-1 px-1 pb-4 pt-1 sm:scroll-p-12 sm:p-12",
        )}
      >
        {auth ? <Profile /> : <Login />}
      </Dialog.Positioner>
    </AuthRoot>
  )
}
