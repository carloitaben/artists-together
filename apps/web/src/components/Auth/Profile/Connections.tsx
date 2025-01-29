"use client"

import { Checkbox } from "@ark-ui/react/checkbox"
import {
  ComponentProps,
  useActionState,
  type PropsWithChildren,
  type ReactNode,
} from "react"
import type { IconName } from "~/lib/icons"
import Icon from "~/components/Icon"
import { useUser } from "~/lib/promises"
import { useForm } from "@conform-to/react"
import { connect, login } from "~/lib/actions"
import { useHydrated } from "~/lib/react"
import { parseWithValibot } from "conform-to-valibot"
import { AuthConnectionFormSchema } from "~/lib/schemas"
import { usePathname } from "next/navigation"
import { cx } from "cva"

function Connection({
  children,
  name,
  icon,
  value,
  connected,
}: ComponentProps<"button"> & {
  icon: IconName
  connected: boolean
}) {
  const Container = connected ? "div" : "button"
  const containerProps = connected
    ? {}
    : ({
        name,
        value,
        type: "submit",
      } satisfies ComponentProps<"button">)

  return (
    <Container
      {...containerProps}
      className="group flex w-full items-center gap-4 text-start"
    >
      <div
        className={cx(
          "grid size-16 flex-none place-items-center rounded-4",
          connected
            ? ":text-gunpla-white-50 bg-gunpla-white-300"
            : "bg-not-so-white text-gunpla-white-500",
        )}
      >
        <Icon src={icon} className="size-6" alt="" />
      </div>
      <div className="w-full flex-1">{children}</div>
      <div className="flex items-center gap-x-2 text-end">
        {connected ? "Connected" : "Disconnected"}
        <Icon
          className="size-3.5"
          src={connected ? "CheckCircle" : "CancelCircle"}
          alt=""
        />
      </div>
    </Container>
  )
}

export default function Connections() {
  const user = useUser()
  const discordUsername = user?.discordUsername
  const twitchUsername = user?.twitchUsername

  const pathname = usePathname()
  const hydrated = useHydrated()
  const [lastResult, action] = useActionState(connect, null)
  const [form, fields] = useForm({
    lastResult,
    onValidate(context) {
      return parseWithValibot(context.formData, {
        schema: AuthConnectionFormSchema,
      })
    },
  })

  return (
    <div className="pb-3 text-xs md:text-sm">
      <div className="gap-x-2 px-3.5 pb-1">Connections</div>
      <form
        id={form.id}
        onSubmit={form.onSubmit}
        action={action}
        noValidate={hydrated}
        className="space-y-2"
      >
        <input type="hidden" name={fields.pathname.name} value={pathname} />
        <Connection
          name={fields.provider.name}
          value="discord"
          icon="Discord"
          connected={Boolean(discordUsername)}
        >
          {discordUsername
            ? `Discord @${discordUsername}`
            : "Connect to Discord"}
        </Connection>
        <Connection
          name={fields.provider.name}
          value="twitch"
          icon="Twitch"
          connected={Boolean(twitchUsername)}
        >
          {twitchUsername ? `Twitch @${twitchUsername}` : "Connect to Twitch"}
        </Connection>
      </form>
    </div>
  )
}
