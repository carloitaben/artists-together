import { z } from "zod"

export const defaultHiddenFields = z.object({
  pathname: z.string(),
})
