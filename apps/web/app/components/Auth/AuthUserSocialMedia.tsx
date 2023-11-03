import { useUserOrThrow } from "~/hooks/loaders"
import * as Modal from "~/components/Modal"
import * as Form from "~/components/Form"

export default function AuthUserSocialMedia() {
  const user = useUserOrThrow()

  return (
    <Modal.Container>
      <Modal.Title>Social media</Modal.Title>
      <Form.Root>
        <h6>Links</h6>
        <ul className="space-y-2">
          <Form.Field name="link" asChild>
            <li>
              <Form.Input type="text" placeholder="https://example.com/user" />
              <Form.Error />
            </li>
          </Form.Field>
          <Form.Field name="link" asChild>
            <li>
              <Form.Input type="text" placeholder="https://example.com/user" />
              <Form.Error />
            </li>
          </Form.Field>
          <Form.Field name="link" asChild>
            <li>
              <Form.Input type="text" placeholder="https://example.com/user" />
              <Form.Error />
            </li>
          </Form.Field>
          <Form.Field name="link" asChild>
            <li>
              <Form.Input type="text" placeholder="https://example.com/user" />
              <Form.Error />
            </li>
          </Form.Field>
          <Form.Field name="link" asChild>
            <li>
              <Form.Input type="text" placeholder="https://example.com/user" />
              <Form.Error />
            </li>
          </Form.Field>
        </ul>
      </Form.Root>
    </Modal.Container>
  )
}
