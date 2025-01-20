import * as v from "valibot"
import { createMiddleware } from "@tanstack/start"
import { FormActionSubmissionResult, FormActionValidator } from "./schemas"

export const formActionMiddleware = createMiddleware()
  .validator(FormActionValidator)
  .server(async (options) => {
    try {
      return options.next()
    } catch (error) {
      if (v.is(FormActionSubmissionResult, error)) {
        return error as unknown as Awaited<ReturnType<typeof options.next>>
      }

      throw error
    }
  })
