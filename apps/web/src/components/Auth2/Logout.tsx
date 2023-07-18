"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"

import { logout } from "~/actions/auth"
import { assertUnreachable } from "~/lib/utils"
import { withAction, PropsWithAction } from "~/components/Form2"
import { useToast } from "~/components/Toast"

type Props = PropsWithAction<typeof logout>

function Logout({ action }: Props) {
  const [isPending, startTransition] = useTransition()
  const { refresh } = useRouter()
  const { emit } = useToast()

  return (
    <button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const { data, serverError, validationError } = await action({})

          if (serverError || validationError) {
            return emit({ title: "Oops! Something went wrong" })
          }

          if (data && "error" in data) {
            switch (data.error) {
              case "UNAUTHORIZED":
                emit({ title: "Oops! You cannot do that" })
                break
              default:
                assertUnreachable(data.error)
            }
          } else {
            emit({ title: "Logged out succesfully" })
            refresh()
          }
        })
      }
    >
      Logout
    </button>
  )
}

export default withAction(Logout, logout)
