import { useUserOrThrow } from "~/hooks/loaders"
import * as Modal from "~/components/Modal"
import * as Form from "~/components/Form"
import AuthUserProfileConnections from "./AuthUserProfileConnections"

export default function AuthUserProfile() {
  const user = useUserOrThrow()

  return (
    <Modal.Container>
      <Modal.Title>{user.username}</Modal.Title>
      <Form.Root className="flex gap-2">
        <Form.Field name="avatar" className="flex flex-col flex-none pr-6">
          <Form.Label>
            <Form.Tooltip align="start">TODO</Form.Tooltip>
            Avatar
          </Form.Label>
          <div className="w-32 h-32 bg-not-so-white flex-none rounded-2xl" />
          <Form.Error />
        </Form.Field>
        <Form.Field name="bio" className="flex flex-col flex-1">
          <Form.Label>Description</Form.Label>
          <Form.Textarea rows={6} placeholder="Placeholder" />
          <Form.Error />
        </Form.Field>
      </Form.Root>
      <AuthUserProfileConnections />
    </Modal.Container>
  )
}
