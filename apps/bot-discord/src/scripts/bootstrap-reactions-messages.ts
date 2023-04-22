import { Client, Partials, GatewayIntentBits, EmbedBuilder } from "discord.js"

import { env } from "~/lib/env"
import { getTextBasedChannel } from "~/lib/helpers"
import { CHANNELS } from "~/lib/constants"

const bot = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
})

await bot.login(env.DISCORD_BOT_TOKEN)

bot.once("ready", async (client) => {
  const channel = await getTextBasedChannel(client, CHANNELS.ROLES)

  const pronounsMessage = await channel.send({
    embeds: [
      new EmbedBuilder({
        description:
          "React to this message to add your preferred pronouns to your roles!" +
          "\n" +
          "🇹" +
          "\n" +
          "They/Them" +
          "\n" +
          "🇸" +
          "\n" +
          "She/Her" +
          "\n" +
          "🇭" +
          "\n" +
          "He/Him",
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
        description:
          "React to this Message to add a location role! We'd like to know this for logistical reasons involving shipping and distribution." +
          "\n" +
          "(We're based in the US, so the locations may be inconsiderately broad the further away you get to us D: very open to suggestion to restructure this!)" +
          "\n" +
          "🦓 - Africa" +
          "\n" +
          "🐻 - West Europe" +
          "\n" +
          "🐺 - East Europe" +
          "\n" +
          "🐯 - West Asia" +
          "\n" +
          "🐍 - East Asia" +
          "\n" +
          "🦫 - North America" +
          "\n" +
          "🐸 - South America" +
          "\n" +
          "🦘 - Oceania" +
          "\n" +
          "🦩 - Caribbean" +
          "\n" +
          "🐪 - Middle East",
        footer: {
          text: "(Please contact @admin if you are having issues with this role assignment message or if you would like your region specified!)",
        },
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
