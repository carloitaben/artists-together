import { registerEventHandler } from "~/lib/core"
import { ROLES } from "~/lib/constants"

registerEventHandler("guildMemberAdd", async (member) => {
  if (!member.pending) {
    await member.roles.add(ROLES.FRIEND, "Passed Membership Screening")
  }
})

registerEventHandler("guildMemberUpdate", async (oldMember, newMember) => {
  if (oldMember.pending !== newMember.pending) {
    await newMember.roles.add(ROLES.FRIEND, "Passed Membership Screening")
  }
})
