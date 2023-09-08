import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { zod } from "../zod"
import { discordPollVotes, discordPolls } from "./sql"
import { db } from "../db"
import { and, eq } from "drizzle-orm"

export const pollsInsertSchema = createInsertSchema(discordPolls)

export const pollsSelectSchema = createSelectSchema(discordPolls)

export const pollVotesSchema = createSelectSchema(discordPollVotes)

export type PollsInsertSchema = z.infer<typeof pollsInsertSchema>

export type PollsSelectSchema = z.infer<typeof pollsSelectSchema>

export type PollVotesSchema = z.infer<typeof pollVotesSchema>

export const create = zod(
  pollsInsertSchema,
  async (poll) => void db.insert(discordPolls).values(poll)
)

export const remove = zod(
  pollsSelectSchema.shape.id,
  async (id) =>
    void Promise.all([
      db.delete(discordPolls).where(eq(discordPolls.id, id)),
      db.delete(discordPollVotes).where(eq(discordPollVotes.pollId, id)),
    ])
)

export const list = zod(z.void(), async () => db.select().from(discordPolls))

export const listFromChannel = zod(
  pollsSelectSchema.shape.channelId,
  async (channelId) =>
    db.select().from(discordPolls).where(eq(discordPolls.channelId, channelId))
)

export const fromId = zod(pollsSelectSchema.shape.id, async (id) =>
  db
    .select()
    .from(discordPolls)
    .where(eq(discordPolls.id, id))
    .then(([value]) => value)
)

export const fromName = zod(pollsSelectSchema.shape.name, async (name) =>
  db
    .select()
    .from(discordPolls)
    .where(eq(discordPolls.name, name))
    .then(([value]) => value)
)

export const votesFromId = zod(pollVotesSchema.shape.pollId, async (pollId) =>
  db.select().from(discordPollVotes).where(eq(discordPollVotes.pollId, pollId))
)

export const votesFromUser = zod(
  pollVotesSchema.pick({
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
  pollVotesSchema.pick({ pollId: true, userId: true, answer: true }),
  async (input) =>
    void db.insert(discordPollVotes).values({
      pollId: input.pollId,
      userId: input.userId,
      answer: input.answer,
    })
)

export const updateVote = zod(
  pollVotesSchema.pick({ id: true, answer: true }),
  async (input) =>
    void db
      .update(discordPollVotes)
      .set({ answer: input.answer })
      .where(eq(discordPollVotes.id, input.id))
)
