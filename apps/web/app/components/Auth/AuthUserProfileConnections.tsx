import { cx } from "cva"
import type { ReactNode } from "react"
import type { Routes } from "remix-routes"
import { useLocation } from "@remix-run/react"
import { useUserOrThrow } from "~/hooks/loaders"
import { validator as connectTwitchValidator } from "~/routes/api.auth.connect.twitch"
import { validator as connectDiscordValidator } from "~/routes/api.auth.connect.discord"
import * as Form from "~/components/Form"
import Icon from "~/components/Icon"

function Connection({
  connected,
  children,
  icon,
}: {
  connected?: boolean
  children: ReactNode
  icon: string
}) {
  return (
    <div className="flex items-center gap-4">
      <div
        className={cx(
          "w-16 h-16 rounded-2xl flex items-center justify-center",
          connected
            ? "bg-gunpla-white-300 text-gunpla-white-50"
            : "bg-not-so-white text-gunpla-white-500",
        )}
      >
        <Icon name={icon} alt="" className="w-6 h-6" />
      </div>
      <div className="flex-1">{children}</div>
      <span className="inline-flex gap-2 text-end items-center justify-end">
        {connected ? "Connected" : "Disconnected"}
        <Icon
          name={connected ? "check-circle" : "cancel-circle"}
          alt=""
          className="w-3.5 h-3.5"
        />
      </span>
    </div>
  )
}

function ConditionalForm({
  connected,
  children,
  action,
  validator,
}: {
  connected?: boolean
  children: ReactNode
  validator: any
  action: keyof Routes
}) {
  const location = useLocation()

  if (connected) {
    return <>{children}</>
  }

  return (
    <Form.Root action={action} validator={validator}>
      <Form.Submit
        type="submit"
        className="w-full [text-align:unset] disabled:opacity-25"
        name="pathname"
        value={location.pathname}
      >
        {children}
      </Form.Submit>
    </Form.Root>
  )
}

export default function AuthUserProfileConnections() {
  const user = useUserOrThrow()

  const isConnectedWithDiscord = !!user?.discord_id
  const isConnectedWithTwitch = !!user?.twitch_id

  return (
    <section className="space-y-1">
      <h6>Connections</h6>
      <div className="space-y-2">
        <ConditionalForm
          connected={isConnectedWithDiscord}
          validator={connectDiscordValidator}
          action="/api/auth/connect/discord"
        >
          <Connection connected={isConnectedWithDiscord} icon="discord">
            {isConnectedWithDiscord
              ? `Discord @${user.discord_username}`
              : "Connect to Discord"}
          </Connection>
        </ConditionalForm>
        <ConditionalForm
          connected={isConnectedWithTwitch}
          validator={connectTwitchValidator}
          action="/api/auth/connect/twitch"
        >
          <Connection connected={isConnectedWithTwitch} icon="twitch">
            {isConnectedWithTwitch
              ? `Twitch @${user.discord_username}`
              : "Connect to Twitch"}
          </Connection>
        </ConditionalForm>
      </div>
    </section>
  )
}
