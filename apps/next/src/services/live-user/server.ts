import "server-only"
import { Tag } from "@artists-together/kv"
import { db, liveUsers, sql } from "@artists-together/db"
import { cache } from "react"
import { unstable_cache } from "next/cache"

export const getRandomLiveUsers = cache(
  unstable_cache(
    async () =>
      db
        .select()
        .from(liveUsers)
        .orderBy(sql`random()`)
        .limit(10)
        .execute(),
    [],
    {
      tags: [Tag.LiveUser],
    },
  ),
)
