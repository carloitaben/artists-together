import { AnyJSONString, JSONStringify } from "@artists-together/core/schemas"
import type { CookieSerializeOptions, HTTPEvent } from "vinxi/http"
import { deleteCookie, getCookie, setCookie } from "vinxi/http"
import * as v from "valibot"

export class Cookie<Name extends string, Schema extends v.GenericSchema> {
  private read

  private write

  constructor(
    public name: Name,
    public schema: Schema,
    public options?: CookieSerializeOptions,
  ) {
    this.read = v.pipe(AnyJSONString, schema)
    this.write = v.pipe(schema, JSONStringify)
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
