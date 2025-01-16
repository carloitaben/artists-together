import * as v from "valibot"
import { AnyJSONString, JSONStringify } from "@artists-together/core/schemas"
import type { CookieSerializeOptions } from "cookie-es"
import { parse, serialize } from "cookie-es"

export function cookieOptions<
  Name extends string,
  Schema extends v.GenericSchema,
>({
  name,
  schema,
  ...options
}: CookieSerializeOptions & {
  name: Name
  schema: Schema
}) {
  const json = schema.type === "string" || schema.type === "picklist"
  const decodeSchema = json ? schema : v.pipe(AnyJSONString, schema)
  const encodeSchema = json
    ? v.pipe(schema, v.string())
    : v.pipe(schema, JSONStringify, v.string())

  return {
    name,
    schema,
    options,
    encode(input: v.InferInput<Schema>) {
      return v.parse(encodeSchema, input)
    },
    decode: v.parser(decodeSchema),
    safeDecode: v.safeParser(decodeSchema),
  }
}

export function deleteDocumentCookie(
  name: string,
  serializeOptions?: CookieSerializeOptions,
) {
  setDocumentCookie(name, "", {
    ...serializeOptions,
    maxAge: 0,
  })
}

export function getDocumentCookie(name: string): string | undefined {
  return parse(document.cookie)[name]
}

export function setDocumentCookie(
  name: string,
  value: string,
  options?: CookieSerializeOptions,
) {
  document.cookie = serialize(name, value, {
    path: "/",
    ...options,
  })
}
