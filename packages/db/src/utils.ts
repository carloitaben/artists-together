import { type ZodTypeAny, type TypeOf, z } from "zod"
import { integer } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"

export function zod<Schema extends ZodTypeAny, Return>(
  schema: Schema,
  callback: (value: TypeOf<Schema>) => Return
) {
  function result(input: TypeOf<Schema>) {
    const parsed = schema.parse(input)
    return callback(parsed)
  }

  return Object.assign(result, schema)
}

export function boolean<const T extends string>(name: T) {
  return integer(name, { mode: "boolean" })
}

export function timestamp<const T extends string>(name: T) {
  return integer(name, { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
}

export const asset = z.object({
  url: z.string().url(),
  base64: z.string(),
  width: z.number(),
  height: z.number(),
  hex: z.string(),
})

export type Asset = z.infer<typeof asset>
