import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding"
import { sha256 } from "@oslojs/crypto/sha2"
import { database, eq, sessionTable, userTable } from "./database"
import type { User, Session } from "./database"

export const SESSION_COOKIE_NAME = "session"

export type SessionValidationResult = { session: Session; user: User } | null

export async function createSession(
  token: string,
  userId: User["id"],
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))

  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  }

  await database.insert(sessionTable).values(session)

  return session
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await database.delete(sessionTable).where(eq(sessionTable.id, sessionId))
}

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20)
  crypto.getRandomValues(bytes)
  return encodeBase32LowerCaseNoPadding(bytes)
}

export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))

  const [data] = await database
    .select({ user: userTable, session: sessionTable })
    .from(sessionTable)
    .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
    .where(eq(sessionTable.id, sessionId))

  if (!data) {
    return null
  }

  if (Date.now() >= data.session.expiresAt.getTime()) {
    await database
      .delete(sessionTable)
      .where(eq(sessionTable.id, data.session.id))

    return null
  }

  if (
    Date.now() >=
    data.session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15
  ) {
    data.session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)

    await database
      .update(sessionTable)
      .set({ expiresAt: data.session.expiresAt })
      .where(eq(sessionTable.id, data.session.id))
  }

  return data
}
