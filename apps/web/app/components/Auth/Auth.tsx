import * as Modal from "~/components/Modal"
import { useUser } from "~/hooks/loaders"
import AuthLoginForm from "./AuthLoginForm"
import AuthUserProfile from "./AuthUserProfile"
import AuthUserSocialMedia from "./AuthUserSocialMedia"
import AuthUserSettings from "./AuthUserSettings"
import AuthUserSupport from "./AuthUserSupport"
import AuthSignOutForm from "./AuthSignOutForm"

export default function Auth() {
  const user = useUser()

  return (
    <Modal.Portal>
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
    </Modal.Portal>
  )
}
