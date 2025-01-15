import * as v from "valibot"
import { AnyJSONString, JSONStringify } from "@artists-together/core/schemas"
import { createIsomorphicFn } from "@tanstack/start"
import { deleteCookie, getCookie, setCookie } from "vinxi/http"
import type { CookieSerializeOptions } from "cookie-es"
import { parse, serialize } from "cookie-es"

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

export function deleteDocumentCookie(
  name: string,
  serializeOptions?: CookieSerializeOptions,
) {
  setDocumentCookie(name, "", {
    ...serializeOptions,
    maxAge: 0,
  })
}

export class SerializeCookieError extends Error {
  constructor(name: string) {
    super()
    this.name = "SerializeCookieError"
    this.message = `Value for cookie '${name}' is not a string.`
  }
}

export class HTTPOnlyCookieError extends Error {
  constructor(name: string) {
    super()
    this.name = "ServerOnlyCookieError"
    this.message = `Cannot set httpOnly cookie '${name}' on the client.`
  }
}

class Cookie<Schema extends v.GenericSchema> {
  private read

  private write

  constructor(
    private environment: "server" | "client",
    public name: string,
    public schema: Schema,
    public options: CookieSerializeOptions,
    private methods: {
      get(name: string): void
      set(name: string, value: string, options?: CookieSerializeOptions): void
      delete(name: string, options?: CookieSerializeOptions): void
    },
  ) {
    const json = schema.type === "string" || schema.type === "picklist"
    this.read = json ? schema : v.pipe(AnyJSONString, schema)
    this.write = json ? schema : v.pipe(schema, JSONStringify)
  }

  private checkHTTPOnly(options?: CookieSerializeOptions) {
    if (this.environment === "server") return

    if (options?.httpOnly || this.options.httpOnly) {
      throw new HTTPOnlyCookieError(this.name)
    }
  }

  public parse() {
    return v.parse(this.read, this.methods.get(this.name))
  }

  public safeParse() {
    return v.safeParse(this.read, this.methods.get(this.name))
  }

  public set(value: v.InferInput<Schema>, options?: CookieSerializeOptions) {
    this.checkHTTPOnly(options)
    const parsed = v.parse(this.write, value)

    if (typeof parsed !== "string") {
      throw new SerializeCookieError(this.name)
    }

    return this.methods.set(this.name, parsed, {
      ...this.options,
      ...options,
    })
  }

  public delete(options?: CookieSerializeOptions) {
    this.checkHTTPOnly()
    return this.methods.delete(this.name, {
      ...this.options,
      ...options,
    })
  }
}

export function createCookie<
  Name extends string,
  Schema extends v.GenericSchema,
>({
  name,
  schema,
  ...defaultOptions
}: CookieSerializeOptions & { name: Name; schema: Schema }) {
  return createIsomorphicFn()
    .server(
      () =>
        new Cookie("server", name, schema, defaultOptions, {
          get: getCookie,
          set: setCookie,
          delete: deleteCookie,
        }),
    )
    .client(
      () =>
        new Cookie("client", name, schema, defaultOptions, {
          get: getDocumentCookie,
          set: setDocumentCookie,
          delete: deleteDocumentCookie,
        }),
    )()
}
