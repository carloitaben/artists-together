import { sql } from "drizzle-orm"
import { integer } from "drizzle-orm/sqlite-core"

/**
 * Creates an unix timestamp column.
 *
 * The value is treated as a `Date` object by `drizzle-orm`,
 * and stored as seconds since `1970-01-01 00:00:00 UTC`.
 */
export function timestamp() {
  return integer({ mode: "timestamp" })
}

export const timestamps = {
  createdAt: timestamp()
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: timestamp()
    .notNull()
    .$onUpdate(() => new Date()), // https://github.com/drizzle-team/drizzle-orm/issues/2323
}
