import * as v from "valibot"
import { AnyJSONString, JSONStringify } from "@artists-together/core/schemas"
import type { CookieSerializeOptions, HTTPEvent } from "vinxi/http"
import { deleteCookie, getCookie, setCookie } from "vinxi/http"

export class Cookie<Name extends string, Schema extends v.GenericSchema> {
  private read

  private write

  constructor(
    public name: Name,
    public schema: Schema,
    public options?: CookieSerializeOptions,
  ) {
    this.read =
      schema.type === "string" ? schema : v.pipe(AnyJSONString, schema)

    this.write =
      schema.type === "string" ? schema : v.pipe(schema, JSONStringify)
  }

  public parse(event: HTTPEvent) {
    return v.parse(this.read, getCookie(event, this.name))
  }

  public safeParse(event: HTTPEvent) {
    return v.safeParse(this.read, getCookie(event, this.name))
  }

  public has(event: HTTPEvent) {
    return this.safeParse(event).success
  }

  public set(
    event: HTTPEvent,
    value: v.InferInput<Schema>,
    options?: CookieSerializeOptions,
  ) {
    const parsed = v.parse(this.write, value)

    if (typeof parsed !== "string") {
      throw Error(
        `Parsed cookie value is not a string. This is likely a bug. Check the value: ${JSON.stringify(parsed, null, 2)}`,
      )
    }

    return setCookie(event, this.name, parsed, {
      ...this.options,
      ...options,
    })
  }

  public delete(event: HTTPEvent, options?: CookieSerializeOptions) {
    return deleteCookie(event, this.name, {
      ...this.options,
      ...options,
    })
  }
}
