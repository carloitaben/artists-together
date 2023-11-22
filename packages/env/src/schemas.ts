import { z } from "zod"

export const botDiscord = z.object({
  DISCORD_BOT_TOKEN: z.string().min(1),
  DISCORD_BOT_ID: z
    .string()
    .min(1)
    .default(() =>
      process.env.NODE_ENV === "development"
        ? String(process.env.DISCORD_BOT_ID)
        : "1097235077966073927"
    ),
  DISCORD_SERVER_ID: z
    .string()
    .min(1)
    .default(
      process.env.NODE_ENV === "development"
        ? String(process.env.DISCORD_SERVER_ID)
        : "762197633062141954"
    ),
})

export const db = z.object({
  DATABASE_AUTH_TOKEN: z.string().default(""),
  DATABASE_URL: z
    .string()
    .url()
    .default(() =>
      process.env.NODE_ENV === "development"
        ? "file:../../.local.db"
        : String(process.env.DATABASE_URL)
    ),
})

export const web = z.object({
  VERCEL_URL: z.string().url().default("http://localhost:3000"),
  DISCORD_OAUTH_ID: z.string().min(1),
  DISCORD_OAUTH_SECRET: z.string().min(1),
  TWITCH_OAUTH_ID: z.string().min(1),
  TWITCH_OAUTH_SECRET: z.string().min(1),
})

export const node = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
})
