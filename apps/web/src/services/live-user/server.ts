import "server-only"
import { Tag } from "@artists-together/core/cache"
import { database, liveUserTable, sql } from "@artists-together/core/database"
import { cache } from "react"
import { unstable_cache } from "next/cache"

export const getRandomLiveUsers = cache(
  unstable_cache(
    async () =>
      database
        .select()
        .from(liveUserTable)
        .orderBy(sql`random()`)
        .limit(10)
        .execute(),
    [],
    {
      tags: [Tag.LiveUser],
    },
  ),
)
