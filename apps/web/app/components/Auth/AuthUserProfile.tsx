import { useUserOrThrow } from "~/hooks/loaders"
import * as Modal from "~/components/Modal"
import * as Form from "~/components/Form"
import AuthUserProfileConnections from "./AuthUserProfileConnections"

export default function AuthUserProfile() {
  const user = useUserOrThrow()

  return (
    <Modal.Container>
      <Modal.Title>{user.username}</Modal.Title>
      <div className="flex">
        <div className="w-32 h-32 bg-not-so-white flex-none"></div>
        <Form.Root>
          <Form.Field name="bio" className="flex flex-col">
            <Form.Label>Description</Form.Label>
            <Form.Textarea placeholder="Placeholder" />
            <Form.Error />
          </Form.Field>
        </Form.Root>
      </div>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <AuthUserProfileConnections />
    </Modal.Container>
  )
}
