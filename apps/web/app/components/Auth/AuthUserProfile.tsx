import { withZod } from "@remix-validated-form/with-zod"
import { validatorSchema } from "~/routes/api.user"
import { useUserOrThrow } from "~/hooks/loaders"
import * as Modal from "~/components/Modal"
import * as Form from "~/components/Form"
import AuthUserProfileConnections from "./AuthUserProfileConnections"

const validator = withZod(validatorSchema.pick({ bio: true }))

export default function AuthUserProfile() {
  const user = useUserOrThrow()

  return (
    <Modal.Container>
      <Modal.Title className="sr-only">Your profile</Modal.Title>
      <Modal.Heading>{user.username}</Modal.Heading>
      <div className="flex gap-2">
        <Form.Root className="flex-none pr-6">
          <Form.Field name="avatar" className="flex flex-col">
            <Form.Label>
              <Form.Tooltip align="start">TODO</Form.Tooltip>
              Avatar
            </Form.Label>
            <div className="w-32 h-32 bg-not-so-white flex-none rounded-2xl" />
            <Form.Error />
          </Form.Field>
        </Form.Root>
        <Form.Root
          className="flex-1"
          validator={validator}
          defaultValues={{ bio: user.bio || "" }}
          navigate={false}
          action="/api/user"
          subaction="bio"
        >
          <Form.Field name="bio" className="flex flex-col w-full h-full">
            <Form.Label className="justify-between">
              <span>Description</span>
              <Form.Value<string>>
                {(value = "") => `${value.length}/128`}
              </Form.Value>
            </Form.Label>
            <Form.Textarea
              className="h-full"
              placeholder="Placeholder"
              maxLength={128}
              submitOnBlur
            />
            <Form.Error />
          </Form.Field>
        </Form.Root>
      </div>
      <AuthUserProfileConnections />
    </Modal.Container>
  )
}
