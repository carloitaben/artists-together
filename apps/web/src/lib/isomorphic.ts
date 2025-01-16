import { createIsomorphicFn } from "@tanstack/start"
import { deleteCookie, getCookie, setCookie } from "vinxi/http"
import type { CookieSerializeOptions } from "cookie-es"
import {
  deleteDocumentCookie,
  getDocumentCookie,
  setDocumentCookie,
} from "./cookies"

export const deleteIsomorphicCookie = createIsomorphicFn()
  .server((name: string, serializeOptions?: CookieSerializeOptions) =>
    deleteCookie(name, serializeOptions),
  )
  .client((name: string, serializeOptions?: CookieSerializeOptions) =>
    deleteDocumentCookie(name, serializeOptions),
  )

export const getIsomorphicCookie = createIsomorphicFn()
  .server((name: string) => getCookie(name))
  .client((name: string) => getDocumentCookie(name))

export const setIsomorphicCookie = createIsomorphicFn()
  .server(
    (name: string, value: string, serializeOptions?: CookieSerializeOptions) =>
      setCookie(name, value, serializeOptions),
  )
  .client(
    (name: string, value: string, serializeOptions?: CookieSerializeOptions) =>
      setDocumentCookie(name, value, serializeOptions),
  )
