import { Client, Partials, GatewayIntentBits, AttachmentBuilder } from "discord.js"

import { env } from "~/lib/env"
import { getTextBasedChannel, staticUrl } from "~/lib/helpers"
import { CHANNELS } from "~/lib/constants"

const bot = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
})

bot.once("ready", async (client) => {
  const channel = await getTextBasedChannel(client, CHANNELS.ANNOUNCEMENTS)
  const newsChannel = await getTextBasedChannel(client, CHANNELS.NEWS)
  const aboutChannel = await getTextBasedChannel(client, CHANNELS.ABOUT)

  await channel.send({
    files: [new AttachmentBuilder(staticUrl("/images/pal_hi-gif.gif"))],
  })

  await channel.send(
    "Hello @everyone! I am Pal *(Programmable Artistic Life-form)* and I will be your assistant around here." +
      "\n" +
      "For now I am only capable of computing pretty basic commands but as times goes on I will be able of many more things!" +
      "\n" +
      "\n" +
      `For more info about me, please check the latest post on ${newsChannel} or my section on ${aboutChannel}`
  )

  console.log("🎉")
})

await bot.login(env.DISCORD_BOT_TOKEN)
