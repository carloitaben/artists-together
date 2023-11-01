import { z } from "zod"

export const defaultHiddenFields = z.object({
  location: z.object({
    pathname: z.string(),
    key: z.string(),
  }),
})
