import { useLocation } from "@remix-run/react"
import { validator } from "~/routes/api.auth.login"
import * as Modal from "~/components/Modal"
import * as Form from "~/components/Form"
import Icon from "~/components/Icon"
import Button from "~/components/Button"

export default function AuthLogin() {
  const location = useLocation()

  return (
    <Modal.Content>
      <Modal.Container>
        <Modal.Title asChild>
          <Modal.Heading className="mb-4 sm:mb-5 text-center sm:text-start">
            Welcome to <br className="sm:hidden" />
            Artists Together
          </Modal.Heading>
        </Modal.Title>
        <Modal.Description className="px-3 text-xs sm:text-base">
          We will be using Discord to manage your Artists Together account.
        </Modal.Description>
      </Modal.Container>
      <Form.Root
        validator={validator}
        action="/api/auth/login"
        className="flex justify-end"
      >
        <Form.Submit asChild>
          <Button
            color={false}
            className="bg-[#5865F2] text-gunpla-white-50 selection:bg-gunpla-white-50 selection:text-[#5865F2]"
            name="pathname"
            value={location.pathname}
          >
            <Icon
              name="discord"
              alt=""
              className="w-4 h-3 sm:w-6 sm:h-[1.125rem] flex items-center justify-center"
            />
            Log-in with Discord
          </Button>
        </Form.Submit>
      </Form.Root>
    </Modal.Content>
  )
}
