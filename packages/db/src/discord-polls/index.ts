import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { zod } from "../utils"
import { db } from "../db"
import { discordPollVotes, discordPolls } from "./sql"

export const PollsInsertSchema = createInsertSchema(discordPolls)

export const PollsSelectSchema = createSelectSchema(discordPolls)

export const PollVotesInsertSchema = createInsertSchema(discordPollVotes)

export const PollVotesSelectSchema = createSelectSchema(discordPollVotes)

export type PollsInsertSchema = z.infer<typeof PollsInsertSchema>

export type PollsSelectSchema = z.infer<typeof PollsSelectSchema>

export type PollVotesInsertSchema = z.infer<typeof PollVotesInsertSchema>

export type PollVotesSelectSchema = z.infer<typeof PollVotesSelectSchema>

export const create = zod(
  PollsInsertSchema,
  async (poll) => void db.insert(discordPolls).values(poll)
)

export const remove = zod(
  PollsSelectSchema.shape.id,
  async (id) =>
    void Promise.all([
      db.delete(discordPolls).where(eq(discordPolls.id, id)),
      db.delete(discordPollVotes).where(eq(discordPollVotes.pollId, id)),
    ])
)

export const list = zod(z.void(), async () => db.select().from(discordPolls))

export const listFromChannel = zod(
  PollsSelectSchema.shape.channelId,
  async (channelId) =>
    db.select().from(discordPolls).where(eq(discordPolls.channelId, channelId))
)

export const fromId = zod(PollsSelectSchema.shape.id, async (id) =>
  db.select().from(discordPolls).where(eq(discordPolls.id, id)).get()
)

export const fromName = zod(PollsSelectSchema.shape.name, async (name) =>
  db.select().from(discordPolls).where(eq(discordPolls.name, name)).get()
)

export const votesFromId = zod(
  PollVotesSelectSchema.shape.pollId,
  async (pollId) =>
    db
      .select()
      .from(discordPollVotes)
      .where(eq(discordPollVotes.pollId, pollId))
)

export const votesFromUser = zod(
  PollVotesSelectSchema.pick({
    pollId: true,
    userId: true,
  }),
  async (input) =>
    db
      .select()
      .from(discordPollVotes)
      .where(
        and(
          eq(discordPollVotes.pollId, input.pollId),
          eq(discordPollVotes.userId, input.userId)
        )
      )
)

export const addVote = zod(
  PollVotesInsertSchema.pick({ pollId: true, userId: true, answer: true }),
  async (input) =>
    void db.insert(discordPollVotes).values({
      pollId: input.pollId,
      userId: input.userId,
      answer: input.answer,
    })
)

export const updateVote = zod(
  PollVotesSelectSchema.pick({ id: true, answer: true }),
  async (input) =>
    void db
      .update(discordPollVotes)
      .set({ answer: input.answer })
      .where(eq(discordPollVotes.id, input.id))
)
