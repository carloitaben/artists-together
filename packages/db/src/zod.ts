import type { ZodTypeAny, TypeOf } from "zod"

export function zod<Schema extends ZodTypeAny, Return>(schema: Schema, callback: (value: TypeOf<Schema>) => Return) {
  function result(input: TypeOf<Schema>) {
    const parsed = schema.parse(input)
    return callback(parsed)
  }

  return Object.assign(result, schema)
}
