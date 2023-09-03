import { cookies } from "next/headers"
import { cache } from "react"
import { auth } from "./server"

export const getSession = cache(() => {
  const authRequest = auth.handleRequest({
    request: null,
    cookies,
  })

  return authRequest.validate()
})
