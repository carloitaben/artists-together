import * as Dialog from "@radix-ui/react-dialog"
import { useUser } from "~/hooks/loaders"
import { validator as logoutValidator } from "~/routes/auth.logout"
import { validator as authValidator } from "~/routes/login"
import { validator as connectTwitchValidator } from "~/routes/auth.connect.twitch"
import { validator as connectDiscordValidator } from "~/routes/auth.connect.discord"
import * as Modal from "./Modal"
import * as Form from "./Form"
import Icon from "./Icon"
import Button from "./Button"

export default function Auth() {
  const user = useUser()

  const isConnectedWithDiscord = !!user?.discord_id
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
              {isConnectedWithDiscord ? (
                <div>
                  <div>connected with twitch :)</div>
                  <Form.Root action="/auth/disconnect/discord" navigate={false}>
                    <Form.Submit type="submit" className="disabled:opacity-25">
                      Disconnect discord
                    </Form.Submit>
                  </Form.Root>
                </div>
              ) : (
                <Form.Root
                  validator={connectDiscordValidator}
                  action="/auth/connect/discord"
                >
                  <Form.Submit type="submit" className="disabled:opacity-25">
                    Connect discord
                  </Form.Submit>
                </Form.Root>
              )}
              {isConnectedWithTwitch ? (
                <div>
                  <div>connected with twitch :)</div>
                  <Form.Root action="/auth/disconnect/twitch">
                    <Form.Submit type="submit" className="disabled:opacity-25">
                      Disconnect twitch
                    </Form.Submit>
                  </Form.Root>
                </div>
              ) : (
                <Form.Root
                  validator={connectTwitchValidator}
                  action="/auth/connect/twitch"
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
              <Form.Submit className="disabled:opacity-25" asChild>
                <Button>Log out</Button>
              </Form.Submit>
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
        )}
      </Modal.Overlay>
    </Dialog.Portal>
  )
}
