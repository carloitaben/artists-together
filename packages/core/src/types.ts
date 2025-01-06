import * as v from "valibot"

export class AssertionError extends Error {
  constructor(options?: ErrorOptions) {
    super("Assertion failed.", options)
    this.name = "AsyncContextInvariantError"
  }
}

/**
 * A type assertion that ensures a given value matches the given `zod` schema.
 */
export function assert<
  Schema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
>(schema: Schema, value: unknown): asserts value is v.InferOutput<Schema> {
  const result = v.safeParse(schema, value)

  if (!result.success) {
    throw new AssertionError({
      cause: {
        value,
        error: result.issues,
      },
    })
  }
}

/**
 * A type guard that ensures a given value is a key of the given object.
 */
export function isKeyOf<T extends Record<PropertyKey, unknown>>(
  object: T,
  value: unknown,
): value is keyof T {
  switch (typeof value) {
    case "string":
    case "number":
    case "symbol":
      return Object.prototype.hasOwnProperty.call(object, value)
    default:
      return false
  }
}
