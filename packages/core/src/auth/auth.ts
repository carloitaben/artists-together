import type {
  DatabaseAdapter,
  SessionAndUser as SessionAndUserType,
} from "lucia"
import { generateSessionId, Lucia } from "lucia"
import { TimeSpan } from "oslo"
import type { SessionTableSelect, UserTableSelect } from "../database"
import { database, eq, sessionTable, userTable } from "../database"

export type Session = SessionTableSelect

export type User = UserTableSelect

export type SessionAndUser = SessionAndUserType<Session, User>

const adapter: DatabaseAdapter<Session, User> = {
  async getSessionAndUser(sessionId): Promise<SessionAndUser> {
    console.log(">>>>>>>>>> calling getSessionAndUser (DB)")

    const result = await database
      .select({
        user: userTable,
        session: sessionTable,
      })
      .from(sessionTable)
      .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
      .where(eq(sessionTable.id, sessionId))
      .get()

    if (!result) {
      return { session: null, user: null }
    }

    return result
  },
  async deleteSession(sessionId) {
    await database
      .delete(sessionTable)
      .where(eq(sessionTable.id, sessionId))
      .run()
  },
  async updateSessionExpiration(sessionId, expiresAt) {
    console.log(">>>>>>>>>> calling updateSessionExpiration (DB)")

    await database
      .update(sessionTable)
      .set({
        expiresAt,
      })
      .where(eq(sessionTable.id, sessionId))
      .run()
  },
}

export const authenticator = new Lucia(adapter, {
  sessionCookieName: "session",
  secureCookies: process.env.NODE_ENV !== "development",
  sessionExpiresInSeconds: new TimeSpan(3, "m").seconds(),
})

export function authenticate(request: Request): Promise<SessionAndUser>

export function authenticate(headers: Headers): Promise<SessionAndUser>

export function authenticate(cookie: string | null): Promise<SessionAndUser>

export function authenticate(input: Request | Headers | string | null) {
  const cookie =
    input instanceof Request
      ? input.headers.get(authenticator.sessionCookieName)
      : input instanceof Headers
        ? input.get(authenticator.sessionCookieName)
        : input

  if (cookie === null) {
    return {
      session: null,
      user: null,
    }
  }

  // TODO: this is used when the input is Headers or Request, to parse the cookie header
  // const sessionId = authenticator.parseSessionCookie(cookie)

  // if (sessionId === null) {
  //   return {
  //     session: null,
  //     user: null,
  //   }
  // }

  return authenticator.validateSession(cookie)
}

export async function createSession(userId: string) {
  const session: Session = {
    id: generateSessionId(),
    userId: userId,
    createdAt: new Date(),
    expiresAt: authenticator.getNewSessionExpiration(),
  }

  await database.insert(sessionTable).values(session).returning()

  return session
}
