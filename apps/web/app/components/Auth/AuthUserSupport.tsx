import { useUserOrThrow } from "~/hooks/loaders"
import * as Modal from "~/components/Modal"

export default function AuthUserSupport() {
  const user = useUserOrThrow()

  return <Modal.Container>AuthUserSupport {user.username}</Modal.Container>
}
