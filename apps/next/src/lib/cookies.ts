import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies"
import type { SafeParseReturnType, TypeOf, ZodTypeAny } from "zod"
import { cookies } from "next/headers"

export function createCookie<Name extends string, Schema extends ZodTypeAny>(
  name: Name,
  schema: Schema,
  baseOptions?: Partial<ResponseCookie>,
) {
  return {
    has() {
      return cookies().has(name)
    },
    get<Strict extends boolean = false>(options?: {
      strict?: Strict
    }): Strict extends true
      ? TypeOf<Schema>
      : SafeParseReturnType<Schema, TypeOf<Schema>> {
      const cookie = cookies().get(name)?.value || ""

      return options?.strict
        ? schema.parse(JSON.parse(cookie))
        : schema.safeParse(JSON.parse(cookie))
    },
    set<Strict extends boolean = false>(
      value: TypeOf<Schema>,
      options?: Partial<ResponseCookie> & { strict?: Strict },
    ): SafeParseReturnType<Schema, TypeOf<Schema>> {
      const { strict, ...resolvedOptions } = {
        ...baseOptions,
        ...options,
      }

      if (strict) {
        const parsed = schema.parse(value)
        cookies().set(name, JSON.stringify(parsed), resolvedOptions)
      }

      const parsed = schema.safeParse(value)

      if (!parsed.success) {
        return parsed
      }

      cookies().set(name, JSON.stringify(parsed.data), resolvedOptions)

      return parsed
    },
  }
}
