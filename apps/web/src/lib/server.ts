import { AnyJSONString } from "@artists-together/core/schemas"
import type { CookieSerializeOptions, HTTPEvent } from "vinxi/http"
import { deleteCookie, getCookie, setCookie } from "vinxi/http"
import type { z, SafeParseReturnType, ZodTypeAny } from "zod"

export class Cookie<Name extends string, Schema extends ZodTypeAny> {
  private json: boolean

  constructor(
    public name: Name,
    public schema: Schema,
    private options?: CookieSerializeOptions,
  ) {
    this.json =
      "typeName" in schema._def ? schema._def.typeName !== "ZodString" : true
  }

  private parse<Strict extends boolean = false>(
    cookie: string | undefined,
    options?: {
      strict?: Strict
    },
  ): Strict extends true
    ? z.output<Schema>
    : SafeParseReturnType<Schema, z.output<Schema>> {
    return this.json
      ? options?.strict
        ? AnyJSONString.pipe(this.schema).parse(cookie)
        : AnyJSONString.pipe(this.schema).safeParse(cookie)
      : options?.strict
        ? this.schema.parse(cookie)
        : this.schema.safeParse(cookie)
  }

  has(event: HTTPEvent) {
    const cookie = getCookie(event, this.name)
    return Boolean(this.parse(cookie, { strict: false }).success)
  }

  get<Strict extends boolean = false>(
    event: HTTPEvent,
    options?: {
      strict?: Strict
    },
  ): Strict extends true
    ? z.output<Schema>
    : SafeParseReturnType<Schema, z.output<Schema>> {
      return this.parse(getCookie(event, this.name), options)
    }

  set(
    event: HTTPEvent,
    value: z.output<Schema>,
    options?: CookieSerializeOptions,
  ) {
    const parsed = this.schema.parse(value)
    setCookie(event, this.name, this.json ? JSON.stringify(parsed) : parsed, {
      ...this.options,
      ...options,
    })
  }

  delete(event: HTTPEvent) {
    return deleteCookie(event, this.name)
  }

  flash<Strict extends boolean = false>(
    event: HTTPEvent,
    options?: {
      strict?: Strict
    },
  ): Strict extends true
    ? z.output<Schema>
    : SafeParseReturnType<Schema, z.output<Schema>> {
      const cookie = getCookie(event, this.name)
      this.delete(event)
      return this.parse(cookie, options)
    }
}
