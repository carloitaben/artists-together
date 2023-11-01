import { redirect } from "@remix-run/node"
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"
import { withZod } from "@remix-validated-form/with-zod"
import { $path } from "remix-routes"
import { validationError } from "remix-validated-form"
import { defaultHiddenFields } from "~/components/Form"
import { auth } from "~/services/auth.server"
import { fromCookie } from "~/services/cookies.server"

export const validator = withZod(defaultHiddenFields)

export async function loader({ request }: LoaderFunctionArgs) {
  return auth.authenticate("discord", request)
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await validator.validate(await request.formData())

  if (form.error) {
    return validationError(form.error)
  }

  return redirect($path("/auth"), {
    headers: {
      "Set-Cookie": await fromCookie.serialize(form.data.location.pathname),
    },
  })
}
