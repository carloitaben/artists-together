import { json } from "@remix-run/node"
// import { DiscordLiveUsers } from "db"
import { oneOf } from "~/lib/utils"

export async function loader() {
  // const users = await DiscordLiveUsers.list()

  // if (!users.length) {
  //   return json(null)
  // }

  // return json(oneOf(users))

  return json(
    oneOf([
      null,
      {
        id: 1,
        url: "https://www.twitch.tv/ibai",
        userId: "123",
        timestamp: "bla",
      },
    ]),
  )
}
