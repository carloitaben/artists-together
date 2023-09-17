import { registerEventHandler } from "~/lib/core"
import { ROLES } from "~/lib/constants"

registerEventHandler("guildMemberAdd", async (member) => {
  console.log(`[guest-role] adding role to new member ${member.user.username}`)
  await member.roles.add(ROLES.GUEST)
  console.log(`[guest-role] added role to new member ${member.user.username}`)
})
