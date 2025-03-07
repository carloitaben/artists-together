import { Dialog } from "@ark-ui/react/dialog"
import { cx } from "cva"
import { getUser } from "~/services/auth/server"
import AuthRoot from "./AuthRoot"
import Profile from "./Profile"
import Login from "./Login"

export default async function Auth() {
  const user = await getUser()

  return (
    <AuthRoot>
      <Dialog.Backdrop className="backdrop z-50" />
      <Dialog.Positioner
        className={cx(
          "fixed inset-0 z-50 grid size-full place-items-center overflow-y-auto",
          "scroll-px-1 scroll-pb-4 scroll-pt-1 px-1 pb-4 pt-1 sm:scroll-p-12 sm:p-12",
        )}
      >
        {user ? <Profile /> : <Login />}
      </Dialog.Positioner>
    </AuthRoot>
  )
}
