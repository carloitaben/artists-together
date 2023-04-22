import { Client, Partials, GatewayIntentBits, EmbedBuilder } from "discord.js"

import { env } from "~/lib/env"
import { getTextBasedChannel } from "~/lib/helpers"
import { CHANNELS } from "~/lib/constants"

const bot = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
})

bot.once("ready", async (client) => {
  const channel = await getTextBasedChannel(client, CHANNELS.ROLES)

  const pronounsMessage = await channel.send({
    embeds: [
      new EmbedBuilder({
        color: 0x5a65ea,
        description: "React to this message to add your preferred pronouns to your roles!",
        fields: [
          {
            name: "🇹  They/Them",
            value: "",
            inline: false,
          },
          {
            name: "🇸  She/Her",
            value: "",
            inline: false,
          },
          {
            name: "🇭  He/Him",
            value: "",
            inline: false,
          },
        ],
      }),
    ],
  })

  try {
    await pronounsMessage.react("🇹")
    await pronounsMessage.react("🇸")
    await pronounsMessage.react("🇭")
  } catch (error) {
    console.error("One of the emojis failed to react:", error)
  }

  const regionMessage = await channel.send({
    embeds: [
      new EmbedBuilder({
        color: 0x5a65ea,
        description: "React to this message to add a region role!",
        fields: [
          {
            name: "🦓  Africa",
            value: "",
            inline: false,
          },
          {
            name: "🐻  West Europe",
            value: "",
            inline: false,
          },
          {
            name: "🐺  East Europe",
            value: "",
            inline: false,
          },
          {
            name: "🐯  West Asia",
            value: "",
            inline: false,
          },
          {
            name: "🐍  East Asia",
            value: "",
            inline: false,
          },
          {
            name: "🦫  North America",
            value: "",
            inline: false,
          },
          {
            name: "🐸  South America",
            value: "",
            inline: false,
          },
          {
            name: "🦘  Oceania",
            value: "",
            inline: false,
          },
          {
            name: "🦩  Caribbean",
            value: "",
            inline: false,
          },
          {
            name: "🐪  Middle East",
            value: "",
            inline: false,
          },
        ],
      }),
    ],
  })

  try {
    await regionMessage.react("🦓")
    await regionMessage.react("🐻")
    await regionMessage.react("🐺")
    await regionMessage.react("🐯")
    await regionMessage.react("🐍")
    await regionMessage.react("🦫")
    await regionMessage.react("🐸")
    await regionMessage.react("🦘")
    await regionMessage.react("🦩")
    await regionMessage.react("🐪")
  } catch (error) {
    console.error("One of the emojis failed to react:", error)
  }
})

await bot.login(env.DISCORD_BOT_TOKEN)
