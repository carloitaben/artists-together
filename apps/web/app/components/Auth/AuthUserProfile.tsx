import * as Dialog from "@radix-ui/react-dialog"
import { useUserOrThrow } from "~/hooks/loaders"
import * as Modal from "~/components/Modal"
import AuthUserProfileConnections from "./AuthUserProfileConnections"

export default function AuthUserProfile() {
  const user = useUserOrThrow()

  return (
    <Modal.Container>
      <Modal.Title>{user.username}</Modal.Title>
      <Dialog.Description>:)</Dialog.Description>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <AuthUserProfileConnections />
    </Modal.Container>
  )
}
