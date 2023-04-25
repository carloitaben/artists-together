import { sql, InferModel } from "drizzle-orm"
import { mysqlTable, text, int, boolean, varchar, serial, timestamp } from "drizzle-orm/mysql-core"

export const otps = mysqlTable("otps", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  active: boolean("active").notNull().default(false),
  attempts: int("attempts").notNull().default(0),
})

export type Otp = InferModel<typeof otps>

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  username: text("username").notNull(),
  bio: text("bio"),
})

export type User = InferModel<typeof users>

// export const userSocials = mysqlTable("socials", {
//   id: serial("id").primaryKey(),
//   url: varchar("name", { length: 255 }),
//   name: varchar("name", { length: 32 }),
//   userId: int("user_id").references(() => users.id),
// })

// export type UserSocial = InferModel<typeof userSocials>