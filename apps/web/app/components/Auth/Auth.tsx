import type { ReactNode } from "react"
import { useEffect } from "react"
import { useSearchParams } from "@remix-run/react"
import { useUser } from "~/hooks/loaders"
import * as Modal from "~/components/Modal"
import AuthLoginForm from "./AuthLoginForm"
import AuthUserProfile from "./AuthUserProfile"
import AuthUserSocialMedia from "./AuthUserSocialMedia"
import AuthUserSettings from "./AuthUserSettings"
import AuthUserSupport from "./AuthUserSupport"
import AuthSignOutForm from "./AuthSignOutForm"

type Props = {
  children: ReactNode
}

export default function Auth({ children }: Props) {
  const [params, setParams] = useSearchParams()
  const user = useUser()

  useEffect(() => {
    if (params.get("modal") !== "auth") return

    setParams(
      (params) => {
        params.delete("modal")
        return params
      },
      { replace: true },
    )
  }, [params, setParams])

  const defaultOpen = params.get("modal") === "auth"

  return (
    <Modal.Root defaultOpen={defaultOpen}>
      {children}
      <Modal.Overlay>
        {user ? (
          <Modal.Content>
            <AuthUserProfile />
            <AuthUserSocialMedia />
            <AuthUserSettings />
            <AuthUserSupport />
            <AuthSignOutForm />
          </Modal.Content>
        ) : (
          <AuthLoginForm />
        )}
      </Modal.Overlay>
    </Modal.Root>
  )
}
