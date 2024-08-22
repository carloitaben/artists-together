import type { ZodTypeAny, output } from "zod"

export function assert<Schema extends ZodTypeAny>(
  value: unknown,
  schema: Schema,
): value is output<Schema> {
  return schema.safeParse(value).success
}

export function isKeyOf<T extends Record<PropertyKey, unknown>>(
  object: T,
  key: unknown,
): key is keyof T {
  switch (typeof key) {
    case "string":
    case "number":
    case "symbol":
      return Object.prototype.hasOwnProperty.call(object, key)
    default:
      return false
  }
}
