import { Client, Events, GatewayIntentBits, SlashCommandBuilder, PermissionFlagsBits } from "discord.js"

import { env } from "~/lib/env"

export const say = new SlashCommandBuilder()
  .setName("say")
  .setDescription("Make PAL say something in the current channel")
  .addStringOption((option) => option.setName("message").setDescription("Message to send").setRequired(true))
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .setDMPermission(false)

const bot = new Client({
  intents: [GatewayIntentBits.Guilds],
})

await bot.login(env.DISCORD_BOT_TOKEN)

bot.addListener(Events.ClientReady, () => {
  console.log("ready")
})

bot.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  switch (interaction.commandName) {
    case say.name:
      const message = interaction.options.getString("message")

      if (!message) {
        await interaction.reply({
          ephemeral: true,
          content: "You have to write a message!",
        })

        return
      }

      if (!interaction.channel) {
        throw Error("Expected channel property in interaction")
      }

      await Promise.all([
        interaction.channel.send(message),
        interaction.reply({
          content: "Done!",
          ephemeral: true,
        }),
      ])

      break
    default:
      interaction.reply({
        ephemeral: true,
        content: "Oops! I cannot handle that command.",
      })
  }
})
