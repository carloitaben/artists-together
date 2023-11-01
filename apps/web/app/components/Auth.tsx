import * as Dialog from "@radix-ui/react-dialog"
import * as Modal from "~/components/Modal"
import * as Form from "~/components/Form"
import { useUser } from "~/hooks/loaders"
import { validator as logoutValidator } from "~/routes/auth.logout"
import { validator as authValidator } from "~/routes/login"
import { validator as twitchValidator } from "~/routes/auth.connect.twitch"
import Icon from "./Icon"

export default function Auth() {
  const user = useUser()

  const isConnectedWithTwitch = !!user?.twitch_id

  return (
    <Dialog.Portal>
      <Modal.Overlay>
        {user ? (
          <Modal.Content>
            <Modal.Container>
              <Modal.Title>Your profile</Modal.Title>
              <Dialog.Description>:)</Dialog.Description>
              <pre>{JSON.stringify(user, null, 2)}</pre>
              {isConnectedWithTwitch ? (
                <div>connected with twitch :)</div>
              ) : (
                <Form.Root
                  validator={twitchValidator}
                  action="/auth/connect/twitch"
                  reloadDocument
                >
                  <Form.Submit type="submit" className="disabled:opacity-25">
                    Connect with twitch
                  </Form.Submit>
                </Form.Root>
              )}
            </Modal.Container>
            <Form.Root
              validator={logoutValidator}
              action="/auth/logout"
              className="flex justify-end"
              navigate={false}
            >
              <Form.Submit className="disabled:opacity-25">Log out</Form.Submit>
            </Form.Root>
          </Modal.Content>
        ) : (
          <Modal.Content className="space-y-4">
            <Modal.Container className="py-10 px-[3.75rem]">
              <Modal.Title className="mb-5">
                Welcome to Artists Together
              </Modal.Title>
              <Dialog.Description>
                We will be using Discord to manage your Artists Together
                account.
              </Dialog.Description>
            </Modal.Container>
            <Form.Root
              validator={authValidator}
              action="/login"
              className="flex justify-end"
            >
              <Form.Submit className="bg-[#5865F2] rounded-full text-gunpla-white-50 px-5 py-3 inline-flex gap-2.5 selection:bg-gunpla-white-50 selection:text-[#5865F2]">
                <Icon name="discord" label="" className="w-6 h-6" />
                Log-in with Discord
              </Form.Submit>
            </Form.Root>
          </Modal.Content>
        )}
        {/* <Dialog.Content className="max-w-xl w-full bg-gunpla-white-50 text-gunpla-white-500 rounded-4xl py-10 px-16">
          {user ? (
            <>
            </>
          ) : (
            <>
              <Modal.Title className="mb-5">
                Welcome to Artists Together
              </Modal.Title>
              <Dialog.Description>
                We will be using Discord to manage your Artists Together
                account.
              </Dialog.Description>
              <Form.Root validator={authValidator} action="/login">
                <Form.Submit className="bg-[#5865F2] rounded-full text-gunpla-white-50 p-5 inline-flex">
                  Log-in with Discord
                </Form.Submit>
              </Form.Root>
            </>
          )}
        </Dialog.Content> */}
      </Modal.Overlay>
    </Dialog.Portal>
  )
}
