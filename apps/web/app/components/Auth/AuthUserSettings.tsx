import { useUserOrThrow } from "~/hooks/loaders"
import * as Modal from "~/components/Modal"

export default function AuthUserSettings() {
  const user = useUserOrThrow()

  return <Modal.Container>AuthUserSettings {user.username}</Modal.Container>
}
