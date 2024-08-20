import "server-only"
import { Tag } from "@artists-together/kv"
import { db, contentShared, sql, users, eq } from "@artists-together/db"
import { cache } from "react"
import { unstable_cache } from "next/cache"

export const getRandomContentShared = cache(
  unstable_cache(
    async () =>
      // db
      //   .select({
      //     url: contentShared.url,
      //     avatar: users.avatar,
      //     username: users.username,
      //   })
      //   .from(contentShared)
      //   .groupBy(sql`${contentShared.userId}`)
      //   .orderBy(sql`random()`)
      //   .limit(5)
      //   .leftJoin(users, eq(contentShared.userId, users.id))
      //   .execute(),
      [
        {
          url: "https://assets.petco.com/petco/image/upload/f_auto,q_auto/832448-center-1",
          username: "chimik3_kill3r_2003",
          avatar: null,
        },
        {
          url: "https://images.saymedia-content.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:eco%2Cw_1200/MTk3MTExMjczMjYxOTAwODgz/cockatiel-baby.jpg",
          username: "trigo",
          avatar:
            "https://biologydictionary.net/wp-content/uploads/2020/07/Two-baby-cockatiels.jpg",
        },
      ],
    [],
    {
      tags: [Tag.WidgetContentShared],
    },
  ),
)
