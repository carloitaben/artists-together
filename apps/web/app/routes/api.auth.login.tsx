import { redirect } from "@vercel/remix"
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@vercel/remix"
import { withZod } from "@remix-validated-form/with-zod"
import { $path } from "remix-routes"
import { validationError } from "remix-validated-form"
import { z } from "zod"
import { zfd } from "zod-form-data"
import { getSearchParams } from "~/lib/params"
import { discord } from "~/server/auth.server"
import { getCookie, oauthCookie } from "~/server/cookies.server"

export const validator = withZod(
  z.object({
    pathname: zfd.text(z.string().min(1)),
  }),
)

const searchParams = z.object({
  url: z.string().url(),
})

export type SearchParams = z.infer<typeof searchParams>

export async function loader({ request }: LoaderFunctionArgs) {
  const params = getSearchParams(request, searchParams)

  if (!params.success) {
    throw Error("*panics in spanish*")
  }

  const cookie = await getCookie(request, oauthCookie)

  if (!cookie) {
    throw Error("*panics in spanish*")
  }

  return redirect(params.data.url)
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await validator.validate(await request.formData())

  if (form.error) {
    return validationError(form.error)
  }

  const [url, state] = await discord.getAuthorizationUrl()

  return redirect($path("/api/auth/login", { url: url.toString() }), {
    headers: {
      "Set-Cookie": await oauthCookie.serialize({
        intent: "login",
        from: form.data.pathname,
        state,
      }),
    },
  })
}
