import * as Modal from "~/components/Modal"
import * as Form from "~/components/Form"

export default function AuthUserSettings() {
  return (
    <Modal.Container>
      <Modal.Title>Advanced settings</Modal.Title>
      <Form.Root action="/asdasd" className="space-y-2">
        <Form.Field
          name="format-24h"
          className="flex items-center justify-between"
        >
          <Form.Label>24-hour time format</Form.Label>
          <Form.Switch />
        </Form.Field>
        <Form.Field
          name="share-location"
          className="flex items-center justify-between"
        >
          <Form.Label className="flex items-center">
            <Form.Tooltip align="start">
              We use your approximate location (region) to let other members
              know your timezone.
            </Form.Tooltip>
            Share approximate location
          </Form.Label>
          <Form.Switch />
        </Form.Field>
        <Form.Field
          name="share-streaming"
          className="flex items-center justify-between"
        >
          <Form.Label className="flex items-center">
            <Form.Tooltip align="start">TODO</Form.Tooltip>
            Share streaming status
          </Form.Label>
          <Form.Switch />
        </Form.Field>
        <Form.Field
          name="share-cursor"
          className="flex items-center justify-between"
        >
          <Form.Label className="flex items-center">
            <Form.Tooltip align="start">TODO</Form.Tooltip>
            Share cursor location
          </Form.Label>
          <Form.Switch />
        </Form.Field>
        <Form.Field
          name="fahrenheit"
          className="flex items-center justify-between"
        >
          <Form.Label>Temperature in Fahrenheit</Form.Label>
          <Form.Switch />
        </Form.Field>
      </Form.Root>
    </Modal.Container>
  )
}
