import { createSafeActionClient } from "next-safe-action"

import { getSession } from "~/services/auth"

export function serverError<const T extends string>(error: T) {
  return { error } as const
}

export const action = createSafeActionClient()

export const privateAction = createSafeActionClient({
  buildContext: async () => {
    const session = await getSession()

    if (!session) {
      throw Error("user is not authenticated!")
    }

    return session
  },
})
