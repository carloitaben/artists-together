import { User } from "lucia"
import { cx } from "class-variance-authority"
import { useMemo } from "react"
import { unreachable } from "~/lib/utils"
import { discordSSO, twitchSSO } from "~/actions/auth"

import type { IconName } from "~/components/Icons"
import Icon from "~/components/Icon"
import ConnectionAction from "./ConnectionAction"

type Props = {
  provider: "discord" | "twitch"
  user: User
  action: typeof discordSSO | typeof twitchSSO
}

export default function Connection({
  provider,
  user,
  action,
  ...props
}: Props) {
  const { connected, icon, name, username } = useMemo<{
    connected: boolean
    icon: IconName
    name: string
    username: string | null | undefined
  }>(() => {
    switch (provider) {
      case "discord":
        return {
          connected: !!user.discord_metadata,
          icon: "discord",
          name: "Discord",
          username: user.discord_username,
        }
      case "twitch":
        return {
          connected: !!user.twitch_metadata,
          icon: "twitch",
          name: "Twitch.tv",
          username: user.twitch_username,
        }
      default:
        return unreachable(provider)
    }
  }, [
    provider,
    user.discord_metadata,
    user.discord_username,
    user.twitch_metadata,
    user.twitch_username,
  ])

  const content = (
    <article {...props} className="flex items-center gap-4 text-start text-sm">
      <div
        className={cx(
          "flex h-16 w-16 flex-none items-center justify-center rounded-2xl",
          connected
            ? " bg-gunpla-white-300 text-gunpla-white-50"
            : " bg-not-so-white text-gunpla-white-500",
        )}
      >
        <Icon label={name} className="h-6 w-6" icon={icon} />
      </div>
      <p className="w-full flex-1">
        {connected ? `${name} @${username}` : `Connect to ${name}`}
      </p>
      <div className="flex items-center gap-x-2 text-end">
        {connected ? "Connected" : "Disconnected"}
        <Icon
          label=""
          className="h-3.5 w-3.5"
          icon={connected ? "checkCircle" : "cancelCircle"}
        />
      </div>
    </article>
  )

  if (!connected) {
    return <ConnectionAction action={action}>{content}</ConnectionAction>
  }

  return content
}
