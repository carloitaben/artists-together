import { sql, InferModel } from "drizzle-orm"
import { mysqlTable, text, int, boolean, varchar } from "drizzle-orm/mysql-core"

function uuid() {
  return varchar("id", { length: 36 })
    .notNull()
    .default(sql`(uuid())`)
}

export const otps = mysqlTable("otps", {
  id: uuid().primaryKey(),
  code: text("code").notNull(),
  active: boolean("active").notNull().default(false),
  attempts: int("attempts").notNull().default(0),
})

export type Otp = InferModel<typeof otps>

export const users = mysqlTable("users", {
  id: uuid().primaryKey(),
  email: text("email").notNull(),
  handle: text("handle").notNull(),
})

export type User = InferModel<typeof users>
