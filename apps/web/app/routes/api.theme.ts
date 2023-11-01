import type { ActionFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { withZod } from "@remix-validated-form/with-zod"
import { Users } from "db"
import { validationError } from "remix-validated-form"
import { z } from "zod"
import { theme } from "~/lib/themes"
import { auth } from "~/services/auth.server"
import { themeCookie } from "~/services/cookies.server"

export const validator = withZod(
  z.object({
    theme,
  }),
)

export async function action({ request }: ActionFunctionArgs) {
  const form = await validator.validate(await request.formData())

  if (form.error) {
    return validationError(form.error)
  }

  const user = await auth.isAuthenticated(request)

  if (user) {
    Users.update({
      id: user.id,
      theme: form.data.theme,
    }).catch(console.error)
  }

  return json(null, {
    headers: {
      "Set-Cookie": await themeCookie.serialize(form.data.theme),
    },
  })
}
