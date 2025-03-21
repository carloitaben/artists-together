"use server"

import { discord, CHANNEL } from "@artists-together/core/discord"
import { getAuth } from "~/features/auth/server"
import { createFormAction } from "~/lib/server"
import { ContactSupportFormSchema } from "~/lib/schemas"

export const contactSupport = createFormAction(
  ContactSupportFormSchema,
  async (context) => {
    const auth = await getAuth()

    if (!auth) {
      throw context.form.reply({
        formErrors: ["Unauthorized"],
      })
    }

    await discord.channels.createMessage(CHANNEL.BOT_SHENANIGANS, {
      content: "Heads up! Received a contact form submission",
      embeds: [
        {
          fields: [
            {
              name: "User",
              value:
                auth.user.discordUsername ||
                auth.user.email ||
                String(auth.user.id),
              inline: false,
            },
            {
              name: "Subject",
              value: context.form.value.subject,
              inline: false,
            },
            {
              name: "Message",
              value: context.form.value.message,
              inline: false,
            },
          ],
        },
      ],
    })
  },
)
