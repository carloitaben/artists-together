import { validator } from "~/routes/api.contact"
import * as Modal from "~/components/Modal"
import * as Form from "~/components/Form"
import Button from "../Button"
import Icon from "../Icon"

export default function AuthUserSupport() {
  return (
    <Modal.Container>
      <Modal.Heading>Contact support</Modal.Heading>
      <Form.Root validator={validator} navigate={false} action="/api/contact">
        <Form.Field name="subject" className="flex flex-col">
          <Form.Label>Subject</Form.Label>
          <Form.Input type="text" placeholder="Example" />
          <Form.Error />
        </Form.Field>
        <Form.Field name="message" className="flex flex-col">
          <Form.Label className="justify-between">
            <span>Message</span>
            <Form.Value<string>>
              {(value = "") => `${value.length}/300`}
            </Form.Value>
          </Form.Label>
          <Form.Textarea rows={7} placeholder="Example" maxLength={300} />
          <Form.Error />
        </Form.Field>
        <div>
          <Form.Label htmlFor="content">
            <Form.Tooltip align="start">TODO</Form.Tooltip>
            Attach files
          </Form.Label>
          <div className="grid grid-cols-3 gap-2">
            <Form.Field name="content">
              <Form.File />
            </Form.Field>
            <Form.Field name="content">
              <Form.File />
            </Form.Field>
            <Form.Field name="content">
              <Form.File />
            </Form.Field>
          </div>
        </div>
        <Form.Submit asChild>
          <Button>
            <Icon name="check" label="Submit" className="w-6 h-6" />
          </Button>
        </Form.Submit>
      </Form.Root>
    </Modal.Container>
  )
}
