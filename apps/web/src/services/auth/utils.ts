import { cookies } from "next/headers"
import { cache } from "react"
import { auth } from "./auth"

export const getSession = cache(() => {
  const authRequest = auth.handleRequest({
    request: null,
    cookies,
  })

  return authRequest.validate()
})
