import * as context from "next/headers"
import { cache } from "react"
import { auth } from "./server"

export const getSession = cache(() => {
  const authRequest = auth.handleRequest("GET", context)
  return authRequest.validate()
})
