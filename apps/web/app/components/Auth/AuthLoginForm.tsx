import * as Modal from "~/components/Modal"
import * as Form from "~/components/Form"
import Icon from "~/components/Icon"
import Button from "~/components/Button"
import { validator } from "~/routes/login"

export default function AuthLogin() {
  return (
    <Modal.Content>
      <Modal.Container>
        <Modal.Title asChild>
          <Modal.Heading className="mb-5">
            Welcome to Artists Together
          </Modal.Heading>
        </Modal.Title>
        <Modal.Description>
          We will be using Discord to manage your Artists Together account.
        </Modal.Description>
      </Modal.Container>
      <Form.Root
        validator={validator}
        action="/login"
        className="flex justify-end"
      >
        <Form.Submit asChild>
          <Button
            color={false}
            className="bg-[#5865F2] text-gunpla-white-50 selection:bg-gunpla-white-50 selection:text-[#5865F2]"
          >
            <Icon name="discord" label="" className="w-6 h-6" />
            Log-in with Discord
          </Button>
        </Form.Submit>
      </Form.Root>
    </Modal.Content>
  )
}
