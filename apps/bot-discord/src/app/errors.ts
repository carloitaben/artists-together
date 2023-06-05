import { EmbedBuilder } from "discord.js"

import { registerEventHandler } from "~/lib/core"
import { getTextBasedChannel } from "~/lib/helpers"
import { CHANNELS } from "~/lib/constants"

registerEventHandler("ready", async (client) => {
  const channel = await getTextBasedChannel(client, CHANNELS.BOT_SHENANIGANS)

  process.on("uncaughtException", (error) => {
    channel.send({
      embeds: [
        new EmbedBuilder({
          color: 0xff1800,
          title: "Oh no!",
          description: "Something somewhere made me crash…",
          timestamp: new Date(),
          fields: [
            {
              name: "Name",
              value: `\`${error.name}\``,
              inline: false,
            },
            {
              name: "Message",
              value: error.message,
              inline: false,
            },
            {
              name: "Stack trace",
              value: error.stack ? `\`\`\`${error.stack}\`\`\`` : "No stack trace found",
              inline: false,
            },
          ],
        }),
      ],
    })
  })
})
