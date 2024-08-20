import type { IconName } from "~/lib/types/icons"
import Icon from "~/components/Icon"
import { authenticate } from "~/services/auth/server"

type ConnectionProps = {
  action: any
  children: (connected: boolean) => string
  connected: boolean
  icon: IconName
}

function Connection({ action, children, connected, icon }: ConnectionProps) {
  return (
    <li>
      <article className="flex items-center gap-4 text-start text-sm">
        <div
          aria-checked={connected}
          className="grid size-16 flex-none place-items-center rounded-2xl bg-not-so-white text-gunpla-white-500 aria-checked:bg-gunpla-white-300 aria-checked:text-gunpla-white-50"
        >
          <Icon name={icon} className="size-6" alt="" />
        </div>
        <p className="w-full flex-1">{children(connected)}</p>
        <div className="flex items-center gap-x-2 text-end">
          {connected ? "Connected" : "Disconnected"}
          <Icon
            className="size-3.5"
            name={connected ? "check-circle" : "cancel-circle"}
            alt=""
          />
        </div>
      </article>
    </li>
  )
}

export default async function ProfileProfileConnections() {
  const auth = await authenticate()

  if (!auth) {
    throw Error("Unauthorized")
  }

  return (
    <ul className="space-y-2">
      <Connection
        action={console.log}
        connected={Boolean(auth.user.discordId)}
        icon="discord"
      >
        {(connected) =>
          connected
            ? `Discord @${auth.user.discordUsername}`
            : "Connect to Discord"
        }
      </Connection>
      <Connection
        action={console.log}
        connected={Boolean(auth.user.twitchId)}
        icon="twitch"
      >
        {(connected) =>
          connected
            ? `Twitch @${auth.user.twitchUsername}`
            : "Connect to Twitch"
        }
      </Connection>
    </ul>
  )
}
