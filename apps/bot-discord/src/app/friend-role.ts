import { ROLE } from "@artists-together/core/discord"
import { registerEventHandler } from "~/lib/core"

registerEventHandler("guildMemberAdd", async (member) => {
  if (!member.pending) {
    await member.roles.add(ROLE.FRIEND, "Passed Membership Screening")
  }
})

registerEventHandler("guildMemberUpdate", async (oldMember, newMember) => {
  if (oldMember.pending !== newMember.pending) {
    await newMember.roles.add(ROLE.FRIEND, "Passed Membership Screening")
  }
})
