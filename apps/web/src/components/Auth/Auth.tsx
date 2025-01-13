import {
  rootRouteId,
  useLocation,
  useNavigate,
  useSearch,
} from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Dialog } from "@ark-ui/react/dialog"
import { cx } from "cva"
import { authenticateQueryOptions } from "~/services/auth/queries"
import Backdrop from "~/components/Backdrop"
import Profile from "./Profile"
import Login from "./Login"

export default function Auth() {
  const auth = useSuspenseQuery(authenticateQueryOptions)
  const navigate = useNavigate()
  const pathname = useLocation({
    select: (state) => state.pathname,
  })

  const open = useSearch({
    from: rootRouteId,
    select: ({ modal }) => modal === "auth",
  })

  return (
    <Dialog.Root
      immediate
      open={open}
      onOpenChange={(details) => {
        if (!details.open) {
          navigate({
            to: pathname,
            replace: true,
            search: (prev) => ({ ...prev, modal: undefined }),
          })
        }
      }}
    >
      <Dialog.Backdrop asChild>
        <Backdrop className="z-50" />
      </Dialog.Backdrop>
      <Dialog.Positioner
        className={cx(
          "fixed inset-0 z-50 grid size-full place-items-center overflow-y-auto",
          "scroll-px-1 scroll-pb-4 scroll-pt-1 px-1 pb-4 pt-1 sm:scroll-p-12 sm:p-12",
        )}
      >
        {auth.data ? <Profile /> : <Login />}
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
