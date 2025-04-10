import { registerEventHandler } from "~/lib/core"
import { ROLE } from "@artists-together/core/discord"

registerEventHandler("guildMemberAdd", async (member) => {
  console.log(`[guest-role] adding role to new member ${member.user.username}`)
  await member.roles.add(ROLE.GUEST)
  console.log(`[guest-role] added role to new member ${member.user.username}`)
})
