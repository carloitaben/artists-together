import { redirect } from "@remix-run/node"
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"
import { withZod } from "@remix-validated-form/with-zod"
import { $path } from "remix-routes"
import { validationError } from "remix-validated-form"
import { z } from "zod"
import { zfd } from "zod-form-data"
import { defaultHiddenFields } from "~/components/Form"
import { getParams } from "~/lib/params"
import { twitch } from "~/server/auth.server"
import { getCookie, oauthCookie } from "~/server/cookies.server"

export const validator = withZod(defaultHiddenFields)

const searchParams = z.object({
  url: zfd.text(z.string().url()),
})

export type SearchParams = z.infer<typeof searchParams>

export async function loader({ request }: LoaderFunctionArgs) {
  const params = getParams(request, searchParams)

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

  const [url, state] = await twitch.getAuthorizationUrl()

  return redirect(
    $path("/auth/connect/twitch", {
      url: url.toString(),
    }),
    {
      headers: {
        "Set-Cookie": await oauthCookie.serialize({
          intent: "connect",
          from: form.data.pathname,
          state,
        }),
      },
    },
  )
}
