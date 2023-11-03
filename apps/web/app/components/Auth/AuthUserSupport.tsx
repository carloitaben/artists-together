import { useUserOrThrow } from "~/hooks/loaders"
import * as Modal from "~/components/Modal"
import * as Form from "~/components/Form"

export default function AuthUserSupport() {
  const user = useUserOrThrow()

  return (
    <Modal.Container>
      <Modal.Title>Contact support</Modal.Title>
      <Form.Root>
        <Form.Field name="subject" className="flex flex-col">
          <Form.Label>Subject</Form.Label>
          <Form.Input type="text" placeholder="Example" />
          <Form.Error />
        </Form.Field>
        <Form.Field name="message" className="flex flex-col">
          <Form.Label className="justify-between">
            <span>Message</span>
            <Form.Value<string>>
              {(value = "") => `${value.length}/128`}
            </Form.Value>
          </Form.Label>
          <Form.Textarea rows={7} placeholder="Example" />
          <Form.Error />
        </Form.Field>
      </Form.Root>
    </Modal.Container>
  )
}
