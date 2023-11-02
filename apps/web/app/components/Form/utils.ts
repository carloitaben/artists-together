import { z } from "zod"
import { zfd } from "zod-form-data"

export const defaultHiddenFields = z.object({
  pathname: zfd.text(z.string()),
})
