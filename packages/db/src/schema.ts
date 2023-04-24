import { InferModel } from "drizzle-orm"
import { mysqlTable, text, int, boolean, serial } from "drizzle-orm/mysql-core"

export const otps = mysqlTable("otps", {
  id: serial("id").primaryKey(),
  code: text("code"),
  active: boolean("active").default(false),
  attempts: int("attempts").default(0),
})

export type Otp = InferModel<typeof otps>

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  handle: text("handle").notNull(),
})

export type User = InferModel<typeof users>
