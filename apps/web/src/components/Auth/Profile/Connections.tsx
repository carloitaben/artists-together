"use client"

import { useMutation } from "@tanstack/react-query"
import { getFormProps } from "@conform-to/react"
import type { ComponentProps } from "react"
import { usePathname } from "next/navigation"
import { cx } from "cva"
import type { IconName } from "~/lib/icons"
import { connect } from "~/features/auth/actions"
import { useUser } from "~/lib/promises"
import { useFormMutation } from "~/lib/mutations"
import { AuthConnectionFormSchema } from "~/lib/schemas"
import Icon from "~/components/Icon"

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
        <span className="sr-only md:not-sr-only">
          {connected ? "Connected" : "Disconnected"}
        </span>
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
  const pathname = usePathname()
  const mutation = useMutation({
    async mutationFn(formData: FormData) {
      return connect(formData)
    },
  })

  const [form, fields] = useFormMutation({
    mutation,
    schema: AuthConnectionFormSchema,
  })

  const discordUsername = user?.discordUsername
  const twitchUsername = user?.twitchUsername

  return (
    <div className="pb-3 text-xs md:text-sm">
      <div className="gap-x-2 px-3 pb-1 md:px-3.5">Connections</div>
      <form {...getFormProps(form)} className="grid gap-y-1 md:gap-y-2">
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
