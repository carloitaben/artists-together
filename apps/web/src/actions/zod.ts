import "server-only"
import { fromZodError } from "zod-validation-error"
import type { TypeOf, ZodError, ZodTypeAny } from "zod"

type Awaitable<T> = T | Promise<T>

export function createActionFactory<Context>(
  context: () => Awaitable<Context>
) {
  return function createAction<Schema extends ZodTypeAny, Result>(
    schema: Schema,
    callback: (input: TypeOf<Schema>, context: Context) => Promise<Result>
  ) {
    return async function action(input: TypeOf<Schema>) {
      const ctx = await context()
      const parsed = schema.safeParse(input)
      if (!parsed.success) {
        return validationError(parsed.error)
      }
      return callback(parsed.data, ctx)
    }
  }
}

export function createAction<Schema extends ZodTypeAny, Result>(
  schema: Schema,
  callback: (input: TypeOf<Schema>) => Promise<Result>
) {
  return async function action(input: TypeOf<Schema>) {
    const parsed = schema.safeParse(input)

    if (!parsed.success) {
      return validationError(parsed.error)
    }

    return callback(parsed.data)
  }
}

export type Action<Schema extends ZodTypeAny, Result> = (
  input: TypeOf<Schema>
) => Promise<Result>

export function validationError<const T = any>(error: ZodError<T>) {
  return {
    error: {
      ...fromZodError(error),
      name: "VALIDATION_ERROR" as const,
    },
  }
}

export function serverError<const T extends string>(cause: T) {
  return {
    error: {
      name: "SERVER_ERROR" as const,
      cause,
    },
  }
}
