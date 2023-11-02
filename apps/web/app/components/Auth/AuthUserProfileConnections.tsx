import { useUserOrThrow } from "~/hooks/loaders"
import { validator as connectTwitchValidator } from "~/routes/auth.connect.twitch"
import { validator as connectDiscordValidator } from "~/routes/auth.connect.discord"
import * as Form from "~/components/Form"

export default function AuthUserProfileConnections() {
  const user = useUserOrThrow()

  const isConnectedWithDiscord = !!user?.discord_id
  const isConnectedWithTwitch = !!user?.twitch_id

  return (
    <div>
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
    </div>
  )
}
