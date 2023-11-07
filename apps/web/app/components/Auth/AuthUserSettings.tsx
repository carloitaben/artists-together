import { withZod } from "@remix-validated-form/with-zod"
import { validatorSchema } from "~/routes/api.user"
import { useUserOrThrow } from "~/hooks/loaders"
import * as Modal from "~/components/Modal"
import * as Form from "~/components/Form"

const validator = withZod(validatorSchema.pick({ settings: true }))

export default function AuthUserSettings() {
  const user = useUserOrThrow()

  return (
    <Modal.Container>
      <Modal.Heading>Advanced settings</Modal.Heading>
      <Form.Root
        action="/api/user"
        subaction="settings"
        validator={validator}
        navigate={false}
        className="space-y-2"
        defaultValues={{ settings: user.settings }}
      >
        <Form.Field
          name="settings.use24HourFormat"
          className="flex items-center justify-between"
        >
          <Form.Label>24-hour time format</Form.Label>
          <Form.Switch submitOnChange />
        </Form.Field>
        <Form.Field
          name="settings.shareLocation"
          className="flex items-center justify-between"
        >
          <Form.Label>
            <Form.Tooltip align="start">
              We use your approximate location (region) to let other members
              know your timezone.
            </Form.Tooltip>
            Share approximate location
          </Form.Label>
          <Form.Switch submitOnChange />
        </Form.Field>
        <Form.Field
          name="settings.shareStreaming"
          className="flex items-center justify-between"
        >
          <Form.Label>
            <Form.Tooltip align="start">TODO</Form.Tooltip>
            Share streaming status
          </Form.Label>
          <Form.Switch submitOnChange />
        </Form.Field>
        <Form.Field
          name="settings.shareCursor"
          className="flex items-center justify-between"
        >
          <Form.Label>
            <Form.Tooltip align="start">TODO</Form.Tooltip>
            Share cursor location
          </Form.Label>
          <Form.Switch submitOnChange />
        </Form.Field>
        <Form.Field
          name="settings.fahrenheit"
          className="flex items-center justify-between"
        >
          <Form.Label>Temperature in Fahrenheit</Form.Label>
          <Form.Switch submitOnChange />
        </Form.Field>
      </Form.Root>
    </Modal.Container>
  )
}
