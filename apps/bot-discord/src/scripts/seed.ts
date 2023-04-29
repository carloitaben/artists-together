import { Client, Partials, GatewayIntentBits, EmbedBuilder } from "discord.js"

import { env } from "~/lib/env"
import { getTextBasedChannel } from "~/lib/helpers"
import { CHANNELS } from "~/lib/constants"

const bot = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
})

async function bootstrapRolesChannel(client: Client) {
  const channel = await getTextBasedChannel(client, CHANNELS.ROLES)

  // maybe send some other messages here

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

  await pronounsMessage.react("🇹")
  await pronounsMessage.react("🇸")
  await pronounsMessage.react("🇭")

  // maybe send some other messages here

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
}

async function bootstrapRulesChannel(client: Client) {
  const channel = await getTextBasedChannel(client, CHANNELS.RULES_N_FAQ)

  // maybe send some other messages here

  const unlockServerMessage = await channel.send({
    embeds: [
      new EmbedBuilder({
        color: 0x5a65ea,
        description: "Neat! Reacting with 🔓 you agree you've read all the rules of this server.",
      }),
    ],
  })

  await unlockServerMessage.react("🔓")

  // maybe send some other messages here
}

bot.once("ready", async (client) => {
  await Promise.all([bootstrapRolesChannel(client), bootstrapRulesChannel(client)])
  console.log("🎉")
})

await bot.login(env.DISCORD_BOT_TOKEN)
