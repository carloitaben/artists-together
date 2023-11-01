import { Authenticator } from "remix-auth"
import type { DiscordProfile, PartialDiscordGuild } from "remix-auth-discord"
import { DiscordStrategy } from "remix-auth-discord"
import { Users } from "db"
import { url } from "~/lib/env"
import { getTheme, session } from "~/services/cookies.server"

export type User = Users.UsersSelectSchema

export interface DiscordUser {
  id: DiscordProfile["id"]
  displayName: DiscordProfile["displayName"]
  avatar: DiscordProfile["__json"]["avatar"]
  email: DiscordProfile["__json"]["email"]
  guilds?: Array<PartialDiscordGuild>
  accessToken: string
  refreshToken: string
}

type PartialDiscordMember = {
  nick: string
  roles: string[]
  user: {
    id: string
    username: string
    avatar: string
  }
}

export const auth = new Authenticator<User>(session)

const discordStrategy = new DiscordStrategy(
  {
    clientID: String(process.env.VITE_DISCORD_OAUTH_ID),
    clientSecret: String(process.env.VITE_DISCORD_OAUTH_SECRET),
    callbackURL: `${url}/auth/discord`,
    scope: ["identify", "email", "guilds", "guilds.members.read"],
  },
  async ({ accessToken, profile, request }): Promise<User> => {
    if (!profile.__json.email) {
      throw Error("Oops missing email")
    }

    const existingUser = await Users.fromUsername(profile.displayName)

    if (existingUser) {
      throw Error("User already exists")
    }

    const theme = await getTheme(request)

    const guilds: Array<PartialDiscordGuild> = await fetch(
      "https://discord.com/api/v10/users/@me/guilds",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    ).then((response) => response.json())

    const user = await Users.create({
      email: profile.__json.email,
      username: profile.displayName,
      avatar: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.__json.avatar}.png`,
      theme,
      discordId: profile.id,
      discordUsername: profile.displayName,
      discordMetadata: JSON.stringify(profile),
    })

    const guild = guilds.find(
      (guild) => guild.id === process.env.DISCORD_SERVER_ID,
    )

    if (!guild) {
      return user
    }

    const member: PartialDiscordMember = await fetch(
      `https://discord.com/api/v10/users/@me/guilds/${process.env.DISCORD_SERVER_ID}/member`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    ).then((response) => response.json())

    console.log(member.user.username, member.roles)

    return user
  },
)

auth.use(discordStrategy)
