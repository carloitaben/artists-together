import { withZod } from "@remix-validated-form/with-zod"
import { validatorSchema } from "~/routes/api.user"
import { useUserOrThrow } from "~/hooks/loaders"
import * as Modal from "~/components/Modal"
import * as Form from "~/components/Form"
import AuthUserProfileConnections from "./AuthUserProfileConnections"

const validator = withZod(validatorSchema.pick({ avatar: true, bio: true }))

export default function AuthUserProfile() {
  const user = useUserOrThrow()

  return (
    <Modal.Container>
      <Modal.Title className="sr-only">Your profile</Modal.Title>
      <Modal.Heading>{user.username}</Modal.Heading>
      <Form.Root
        className="flex gap-2"
        validator={validator}
        navigate={false}
        action="/api/user"
        subaction="profile"
        defaultValues={{
          avatar: user.avatar,
          bio: user.bio,
        }}
      >
        <Form.Field name="avatar" className="flex flex-col flex-none pr-6">
          <Form.Label>
            <Form.Tooltip align="start">TODO</Form.Tooltip>
            Avatar
          </Form.Label>
          <Form.File
            bucket="public"
            folder="avatar"
            className="w-32 h-32 flex-none"
            submitOnChange
          />
          <Form.Error />
        </Form.Field>
        <Form.Field name="bio" className="w-full h-full flex-1">
          <Form.Label className="justify-between">
            <span>Description</span>
            <Form.Value<typeof user.bio>>
              {(value) => `${value ? value.length : 0}/128`}
            </Form.Value>
          </Form.Label>
          <Form.Textarea
            className="h-32 w-full"
            placeholder="Placeholder"
            maxLength={128}
            submitOnBlur
          />
          <Form.Error />
        </Form.Field>
      </Form.Root>
      <AuthUserProfileConnections />
    </Modal.Container>
  )
}
