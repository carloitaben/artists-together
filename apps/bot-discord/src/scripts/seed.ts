import "dotenv-mono/load"
import {
  Client,
  Partials,
  GatewayIntentBits,
  AttachmentBuilder,
} from "discord.js"
import {
  getChannel,
  getTextBasedChannel,
  getRole,
  getGuild,
  getPublicFile,
} from "~/lib/utils"
import { CHANNEL, ROLE } from "@artists-together/core/discord"

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
})

async function bootstrapRulesChannel(client: Client) {
  const [rulesChannel, introductionsChannel] = await Promise.all([
    getTextBasedChannel(client, CHANNEL.RULES_N_FAQ),
    getChannel(client, CHANNEL.INTRODUCTIONS),
  ])

  await rulesChannel.send({
    files: [
      new AttachmentBuilder(
        getPublicFile("/images/banners/banner-about-rules.png")
      ),
    ],
  })

  await rulesChannel.send({
    embeds: [
      {
        color: 0xf0913f,
        description:
          `## ✅ If you are an artist, introduce yourself in ${introductionsChannel} to get verified` +
          `\n` +
          `​` +
          `\n` +
          `## 👀 Enable "Show All Channels" to not miss anything!` +
          `\n` +
          `​` +
          `\n` +
          `## :one: Follow Discord's [ToS](https://discord.com/terms) & [Community Guidelines](https://discord.com/guidelines)` +
          `\n` +
          `​` +
          `\n` +
          `## :two: Be respectful` +
          `\n` +
          `- Any form of harassment, hate speech, or bullying will not be tolerated.` +
          `\n` +
          `- Refrain from critiquing others' work unless it's asked for.` +
          `\n` +
          `\n` +
          `## :three: Keep topics relevant to the appropriate channels` +
          `\n` +
          `​` +
          `\n` +
          `## :four: No spam` +
          `\n` +
          `- Avoid repetitive and excessive messages, pings or embeds, and such.`,
      },
    ],
  })

  await rulesChannel.send({
    embeds: [
      {
        color: 0xf0913f,
        description:
          `*✱ If you experience a rule break, please contact a moderator.*` +
          `\n` +
          `\n` +
          `*✱ These rules are non-exhaustive, human beings will use their judgement when dealing with disruptive behaviour!*` +
          `\n` +
          `\n` +
          `*✱ Please keep in mind these rules extend to behaviour in the voice channels, DMs, and all content linked, as well.*`,
      },
    ],
  })

  await rulesChannel.send({
    embeds: [
      {
        color: 0xf4f4f4,
        description:
          `**✨ A worldwide, inclusive, and diverse community for all kinds of artists and skill levels.**` +
          `\n` +
          `## Our goal` +
          `\n` +
          `Give artists from around the globe a voice, a place to celebrate and promote their creative content and, of course, have some fun.` +
          `\n` +
          `\n` +
          `We hope you see this community as a safe space to learn, build, and share your creative journey among each other. Collaboration is highly encouraged!`,
      },
    ],
  })

  await rulesChannel.send({
    embeds: [
      {
        color: 0xf4f4f4,
        description:
          `## Backstory` +
          `\n` +
          `In October 2020, MissDaisyDee, AnonymousTurtle, and LittleChook created *"Artist Back Alley"* as an accountability group for online artists to prepare for the holidays shopping season.` +
          `\n` +
          `\n` +
          `Then, the first community project was launched, the *"Hype Train"* invited members to submit their unique box-cars to be hooked up together, creating one glorious hyper train!` +
          `\n` +
          `\n` +
          `Later, this event renamed as *"Artist Raid Train"*, kept inviting streamers to raid each other on Twitch.` +
          `\n` +
          `\n` +
          `Since launch, this community keeps evolving, still remaining true to the founders' goal of creating an inclusive space for all creatives to mingle, grow, and collaborate.` +
          `\n` +
          `\n` +
          `In 2023, we rebranded as *"Artists Together"* with the debut of a new website as a part of our own ecosystem, lead by Vanilla.` +
          `\n` +
          `\n` +
          `*"Collaboration is the heart of this server. I am grateful for the efforts and genius of both Daisy and Turtle, but it took a VILLAGE of fellow passionate creatives to keep this community thriving. I take immense pride in helping to lay the foundation, and I hope members share this same pride- Because we built this together. We're artists together."* - LittleChook`,
      },
    ],
  })

  await rulesChannel.send({
    content:
      "**Website:** https://artiststogether.online/" +
      "\n" +
      "**Instagram:** https://instagram.com/artiststogether.online" +
      "\n" +
      "**Bluesky:** https://bsky.app/profile/artiststogether.online" +
      "\n" +
      "**Twitch:** https://twitch.tv/artiststogether" +
      "\n" +
      "**Youtube:** https://www.youtube.com/@artiststogether" +
      "\n" +
      "**Discord:** https://discord.artiststogether.online" +
      "\n" +
      "**Mail:** [info@artiststogether.online](mailto:info@artiststogether.online)",
  })

  await rulesChannel.send({
    files: [
      new AttachmentBuilder(getPublicFile("/images/banners/banner-pal.png")),
    ],
  })

  await rulesChannel.send({
    embeds: [
      {
        color: 0x3524f5,
        description:
          `Hey there! I am Pal *(Programmable Artistic Life-form)*, the assistant bot of Artists Together.` +
          `\n` +
          `\n` +
          `I have been created to assist the community in creative-related matters. I am still in development, please be patient!`,
      },
    ],
  })

  await rulesChannel.send({
    files: [
      new AttachmentBuilder(getPublicFile("/images/banners/banner-roles.png")),
    ],
  })

  const guild = await getGuild(client)
  const [roleModerator, roleVerified, roleUnverified, roleWeb, rolePal] =
    await Promise.all([
      getRole(guild.roles, ROLE.MOD),
      getRole(guild.roles, ROLE.VERIFIED),
      getRole(guild.roles, ROLE.UNVERIFIED),
      getRole(guild.roles, ROLE.WEB),
      getRole(guild.roles, ROLE.PAL),
    ])

  await rulesChannel.send({
    embeds: [
      {
        color: 0xddfe6e,
        description:
          `${roleModerator} — Server moderator` +
          "\n" +
          `${roleVerified} — Verified member involved in creative activities` +
          "\n" +
          `${roleUnverified} — Unverified member of the community` +
          "\n" +
          `${roleWeb} — Member registered in [artiststogether.online](https://www.artiststogether.online/)` +
          "\n" +
          `${rolePal} — This is Pal, our assistant bot`,
      },
    ],
  })
}

bot.once("ready", async (client) => {
  await bootstrapRulesChannel(client)
  console.log("🎉")
})

await bot.login(process.env.DISCORD_BOT_TOKEN)
