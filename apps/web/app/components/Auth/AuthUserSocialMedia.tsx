import { useUserOrThrow } from "~/hooks/loaders"
import * as Modal from "~/components/Modal"

export default function AuthUserSocialMedia() {
  const user = useUserOrThrow()

  return <Modal.Container>AuthUserSocialMedia {user.username}</Modal.Container>
}
