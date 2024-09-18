import type { output, ZodTypeAny } from "zod"

export type ValueOf<T> = T[keyof T]

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type MaybePromise<T> = T | Promise<T>

export type IsUnion<T, K = T> = [T] extends [never]
  ? false
  : T extends never
    ? false
    : [K] extends [T]
      ? false
      : [T | undefined] extends [K]
        ? true
        : false

export type AnyToUnknown<T> = (0 extends 1 & T ? true : false) extends true
  ? unknown
  : T

/**
 * A type guard that ensures a given value matches the given `zod` schema.
 */
export function is<Schema extends ZodTypeAny>(
  value: unknown,
  schema: Schema,
): value is output<Schema> {
  return schema.safeParse(value).success
}

export class AssertionError extends Error {
  constructor(options?: ErrorOptions) {
    super("Assertion failed.", options)
    this.name = "AsyncContextInvariantError"
  }
}

/**
 * A type assertion that ensures a given value matches the given `zod` schema.
 */
export function assert<Schema extends ZodTypeAny>(
  value: unknown,
  schema: Schema,
): asserts value is output<Schema> {
  const result = schema.safeParse(value)

  if (!result.success) {
    throw new AssertionError({
      cause: {
        value,
        error: result.error,
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
