import dayjs from "dayjs"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import { ROLES } from "~/lib/constants"
import { registerEventHandler } from "~/lib/core"
import { cron, getGuild } from "~/lib/helpers"

dayjs.extend(isSameOrAfter)

registerEventHandler("ready", (client) => {
  cron("0 0 * * *", async () => {
    const guild = await getGuild(client)
    const members = await guild.members.list()

    console.log("[kick-guests] members size", members.size)
    members.forEach(async (member) => {
      if (!member.roles.cache.has(ROLES.GUEST)) return

      const joinedAt = dayjs(member.joinedAt)
      const aMonthAgo = dayjs().add(-1, "month")

      if (!joinedAt.isBefore(aMonthAgo)) return

      console.log(`[kick-guests] sending dm to ${member.user.username}`)

      await member.user
        .send(
          "Hello 👋 I’m Pal, assistant bot from the Artists Together community." +
            "\n" +
            "\n" +
            "It looks like you joined the server a while ago but did not accept the rules." +
            "\n" +
            "To mitigate inactivity we have to kick you from the server, but you’re free to join again whenever you want!" +
            "\n" +
            "https://discord.gg/9Ayh9dvhHe",
        )
        .catch((error) => {
          console.log(
            `[kick-guests] error sending dm to ${member.user.username}`,
          )
          console.error(error)
        })

      console.log(`[kick-guests] kicking guest ${member.user.username}`)
      await member.kick("Inactivity")
    })
  })
})
