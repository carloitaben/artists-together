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
  const seekingCritiqueChannel = await getTextBasedChannel(client, CHANNELS.SEEKING_CRITIQUE)

  await channel.send("RULES IMAGE")

  await channel.send({
    embeds: [
      new EmbedBuilder({
        color: 0x024456,
        description:
          "**Please follow these simple rules to keep this place inclusive and friendly for everyone.**" +
          "\n" +
          "\n" +
          "--------------------" +
          "\n" +
          "\n" +
          "**Rule 1:** Follow Discord's Terms of Service and Community Guidelines." +
          "\n" +
          "[*Terms of Service*](https://discord.com/terms)" +
          "\n" +
          "[*Community Guidelines*](https://discord.com/guidelines)" +
          "\n" +
          "\n" +
          "**Rule 2:** Be respectful." +
          "\n" +
          "*Racism, sexism, homophobia, harassment or any form of bullying or hate speech will not be tolerated anywhere on the server.*" +
          "\n" +
          "\n" +
          "**Rule 3:** Keep topics relevant to the appropriate channels." +
          "\n" +
          `*Refrain from critiquing others' work unless it is asked for, or posted in ${seekingCritiqueChannel}*` +
          "\n" +
          "*Use the off-topic category for non-related AT topics.*" +
          "\n" +
          "\n" +
          "**Rule 4:** No spam." +
          "\n" +
          "*Avoid repeated and/or excessive messages. Like pings or embeds, for example.*" +
          "\n" +
          "\n" +
          "--------------------" +
          "\n" +
          "\n" +
          "✱ If you experience a rule break, please contact a moderator." +
          "\n" +
          "\n" +
          "✱ These rules are non-exhaustive, human beings will use their judgement when dealing with disruptive behaviour!" +
          "\n" +
          "\n" +
          "✱ Please keep in mind that these rules extend to behaviour in the Voice channels, DMs and all content linked in the channels, as well. ",
      }),
    ],
  })

  await channel.send({
    embeds: [
      new EmbedBuilder({
        color: 0x024456,
        description:
          "**Frequently asked questions that might help you understand how this community works.**" +
          "\n" +
          "\n" +
          "--------------------" +
          "\n" +
          "\n" +
          "**How can I be part of this community?**" +
          "\n" +
          "*If you are reading this, you already are! Everyone is free to join or leave whenever they want.*" +
          "\n" +
          "\n" +
          "**Do I need to be an artist/creative to join this community?**" +
          "\n" +
          "*Mainly, this is a place for creatives, but if you do not practise any art medium and you just want to see others' creations, you're more than welcome too.*" +
          "\n" +
          "\n" +
          "**Is there any kind of subscription fee?**" +
          "\n" +
          "*Nope, it is and it will keep being totally free! You can of course donate to help us cover the expenses.*",
      }),
    ],
  })

  const unlockServerMessage = await channel.send({
    embeds: [
      new EmbedBuilder({
        color: 0x024456,
        description: "*Neat! Reacting with 🔓 you agree you've read all the rules of this server.*",
      }),
    ],
  })

  await unlockServerMessage.react("🔓")
}

async function bootstrapAboutChannel(client: Client) {
  const channel = await getTextBasedChannel(client, CHANNELS.ABOUT)

  await channel.send("ABOUT IMAGE")

  await channel.send({
    embeds: [
      new EmbedBuilder({
        color: 0xff1800,
        description:
          "**Artists Together** is an online, worldwide inclusive community for all kinds of artists and all skill levels." +
          "\n" +
          "\n" +
          "**Our goal**" +
          "\n" +
          "The main objective of this community is to give artists from around the globe a voice, a place to celebrate and promote their creative content and, of course, have some fun!" +
          "\n" +
          "\n" +
          "We hope that members of A.T. will see this server as a safe space to learn, build, and share their creative journey among each other." +
          "\n" +
          "Collaboration is highly encouraged!",
      }),
    ],
  })

  await channel.send({
    embeds: [
      new EmbedBuilder({
        color: 0xff1800,
        description:
          "**Backstory**" +
          "\n" +
          'This server was created in October 2020 as *"Artist Back Alley"* by *MissDaisyDee*, *AnonymousTurtle*, and *LittleChook* as an accountability group for fellow creatives with online shops to prepare for the impending holiday shopping season.' +
          "\n" +
          "\n" +
          'As a big debut for the birth of this server, Artist Back Alley successfully launched its first community art project the "Hyper Train" where members submitted their designed box-cars to be hooked up together by other submissions, creating one glorious hyper train! You can still view the Hyper Train here: https://artistbackalley.com/' +
          "\n" +
          "\n" +
          "Since launch, this server has grown and evolved - Still remaining true to the founders' goal of creating an inclusive space for all creatives to mingle, grow, and collaborate." +
          "\n" +
          "\n" +
          '*"Collaboration is the heart of this server. I am grateful for the efforts and genius of both Daisy and Turtle in creating this, but it took a VILLAGE of fellow passionate creatives to keep this community growing and thriving. I take immense pride in helping to lay the foundation, and I hope that members share this same pride - because we built this together. We\'re artists together."* - LittleChook',
      }),
    ],
  })

  await channel.send({
    content:
      "**Website:** https://artiststogether.online/" +
      "\n" +
      "**Instagram:** https://instagram.com/artiststogether.online" +
      "\n" +
      "**Twitch:** https://twitch.tv/artiststogether" +
      "\n" +
      "**Youtube:** https://www.youtube.com/@artiststogether" +
      "\n" +
      "**Discord:** https://discord.gg/9Ayh9dvhHe" +
      "\n" +
      "\n" +
      "*You can also contact us at info@artiststogether.online*",
  })

  await channel.send("ART IMAGE")

  await channel.send({
    embeds: [
      new EmbedBuilder({
        color: 0xffdc48,
        description:
          "**Artist Raid Train** is an online event done periodically where artists from the community stream and raid each other on Twitch." +
          "\n" +
          "\n" +
          "Participating in the A.R.T. event is an excellent opportunity to:" +
          "\n" +
          "- *Meet and make new friends in the art streaming community.*" +
          "\n" +
          "- *Connect and engage with the A.T. members on a more personal level.*" +
          "\n" +
          "- *Promote your work, your channel, your shop/commissions page, etc.*" +
          "\n" +
          "- *Learn more about new art mediums/styles/processes.*" +
          "\n" +
          "- *Help you reach your stream goals.*",
      }),
    ],
  })

  await channel.send("PAL IMAGE")

  await channel.send({
    embeds: [
      new EmbedBuilder({
        color: 0x3924ff,
        description:
          "Hey there! **I am Pal** *(Programmable Artistic Life-form)*, the assistant bot of this community." +
          "\n" +
          "\n" +
          "I have been created to be as diverse as possible, so no one can say I am ugly- That's why I have so many faces! But if you see a blob of color with horns and floating extremities, you can be 96.33% sure that's me!" +
          "\n" +
          "\n" +
          "My current job is to assist members on community-related topics and help moderators with automated processes." +
          "\n" +
          "For now, I'll be announcing events and updates too." +
          "\n" +
          "\n" +
          "I am the Pal you need!",
      }),
    ],
  })
}

bot.once("ready", async (client) => {
  await Promise.all([bootstrapRolesChannel(client), bootstrapRulesChannel(client), bootstrapAboutChannel(client)])

  console.log("🎉")
})

await bot.login(env.DISCORD_BOT_TOKEN)
