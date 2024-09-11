import "server-only"
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies"
import { cookies } from "next/headers"
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
    delete() {
      return cookies().delete(name)
    },
  }
}

export function error<T extends string>(error: { cause: T; message?: string }) {
  return {
    error,
  } as const
}
