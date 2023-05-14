import { Client, Partials, GatewayIntentBits, AttachmentBuilder, EmbedBuilder } from "discord.js"

import { env } from "~/lib/env"
import { getGuild, getRole, getTextBasedChannel, staticUrl } from "~/lib/helpers"
import { CHANNELS, ROLES } from "~/lib/constants"

const bot = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
})

bot.once("ready", async (client) => {
  const guild = await getGuild(client)
  const channel = await getTextBasedChannel(client, CHANNELS.ABOUT)

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
    files: [new AttachmentBuilder(staticUrl("/images/banners/roles.png"))],
  })

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
          `${rolePal} - That's me, Pal! Friendly A.T. assistant bot!`,
      }),
    ],
  })
})

await bot.login(env.DISCORD_BOT_TOKEN)
