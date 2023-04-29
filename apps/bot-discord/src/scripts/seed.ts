import { Client, Partials, GatewayIntentBits, EmbedBuilder } from "discord.js"

import { env } from "~/lib/env"
import { getTextBasedChannel, getRole, getGuild } from "~/lib/helpers"
import { CHANNELS, ROLES } from "~/lib/constants"

const bot = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
})

async function bootstrapRolesChannel(client: Client) {
  const guild = await getGuild(client)
  const channel = await getTextBasedChannel(client, CHANNELS.ROLES)

  const [
    roleAdmin,
    roleModerator,
    roleArtist,
    roleFriend,
    roleGuest,
    rolePal,
    roleArtStreamer,
    roleTechSupport,
    roleLiveNow,
    roleBooster,
  ] = await Promise.all([
    getRole(guild.roles, ROLES.ADMIN),
    getRole(guild.roles, ROLES.MODERATOR),
    getRole(guild.roles, ROLES.ARTIST),
    getRole(guild.roles, ROLES.FRIEND),
    getRole(guild.roles, ROLES.GUEST),
    getRole(guild.roles, ROLES.PAL),
    getRole(guild.roles, ROLES.ART_STREAMER),
    getRole(guild.roles, ROLES.TECH_SUPPORT),
    getRole(guild.roles, ROLES.LIVE_NOW),
    getRole(guild.roles, ROLES.SERVER_BOOSTER),
  ])

  await channel.send({
    embeds: [
      new EmbedBuilder({
        color: 0xf4f4f4,
        description:
          `${roleAdmin} - Administrator of the server.` +
          "\n" +
          `${roleModerator} - Moderator of the server.` +
          "\n" +
          `${roleArtist} - Member that takes part in creative activities.` +
          "\n" +
          `${roleFriend} - Member who is just hanging around~` +
          "\n" +
          `${roleGuest} - Peep who just joined the server.` +
          "\n" +
          "\n" +
          `${rolePal} - That's me, Pal! Friendly A.T. assistant bot!` +
          "\n" +
          `${roleArtStreamer} - Members who are participating in the next ART event.` +
          "\n" +
          `${roleTechSupport} - Members helping tech-wise.` +
          "\n" +
          `${roleLiveNow} - People that are streaming on Twitch at the moment.` +
          "\n" +
          `${roleBooster} - People who are boosting this server`,
      }),
    ],
  })

  const pronounsMessage = await channel.send({
    embeds: [
      new EmbedBuilder({
        color: 0xf4f4f4,
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

  const regionMessage = await channel.send({
    embeds: [
      new EmbedBuilder({
        color: 0xf4f4f4,
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
        color: 0x024456,
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
