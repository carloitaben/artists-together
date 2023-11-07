import type { ActionFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { withZod } from "@remix-validated-form/with-zod"
import { validationError } from "remix-validated-form"
import { z } from "zod"
import { zfd } from "zod-form-data"
import { theme } from "~/lib/themes"
import { auth } from "~/server/auth.server"
import { themeCookie } from "~/server/cookies.server"

export const validator = withZod(
  z.object({
    theme: zfd.text(theme),
  }),
)

export async function action({ request }: ActionFunctionArgs) {
  const form = await validator.validate(await request.formData())

  if (form.error) {
    return validationError(form.error)
  }

  const authRequest = await auth.handleRequest(request).validate()

  if (authRequest) {
    auth
      .updateUserAttributes(authRequest.user.userId, {
        theme: form.data.theme,
      })
      .catch(console.error)
  }

  return json(null, {
    headers: {
      "Set-Cookie": await themeCookie.serialize(form.data.theme),
    },
  })
}
