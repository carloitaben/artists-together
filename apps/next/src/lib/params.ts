import type { ReadonlyURLSearchParams } from "next/navigation"
import type { SafeParseReturnType, TypeOf, ZodTypeAny } from "zod"

export function parseSearchParams<
  Schema extends ZodTypeAny,
  Strict extends boolean = false,
>(
  params: ReadonlyURLSearchParams | URLSearchParams,
  options: {
    schema: Schema
    strict?: Strict
  },
): Strict extends true
  ? TypeOf<Schema>
  : SafeParseReturnType<Schema, TypeOf<Schema>> {
  const searchParams =
    params instanceof URLSearchParams
      ? Object.fromEntries(params.entries())
      : params

  return options.strict
    ? options.schema.parse(searchParams)
    : options.schema.safeParse(searchParams)
}
