import { json, type LoaderArgs } from "@vercel/remix"
import { auth, getOrCreateValidOtp } from "~/services/auth.server"

export const config = { runtime: "edge", regions: ["iad1"] }

export async function loader(params: LoaderArgs) {
  console.log("running SIGNUP loader")
  return "something"
}

export async function action({ request }: LoaderArgs) {
  const headers = new Headers()
  const authRequest = auth.handleRequest(request, headers)
  const validation = await authRequest.validateUser()
  if (validation.session) {
    return json(null, {
      status: 401,
      headers,
    })
  }

  const formData = await request.formData()
  const email = formData.get("email")?.toString()
  const username = formData.get("username")?.toString()

  if (!email || !username) {
    return json(null, { status: 400, headers })
  }

  try {
    const key = await auth.getKey("email", email)
    const otp = await getOrCreateValidOtp(key.userId)
    console.log(`Send to email ${email} otp code: ${otp.toString()}`)
    return json(null, { status: 200, headers })
  } catch (error) {
    console.error(error)
    return json(null, { status: 500, headers })
  }
}
