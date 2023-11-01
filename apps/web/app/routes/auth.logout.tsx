import type { ActionFunctionArgs } from "@remix-run/node"
import { withZod } from "@remix-validated-form/with-zod"
import { validationError } from "remix-validated-form"
import { auth } from "~/services/auth.server"
import { defaultHiddenFields } from "~/components/Form"

export const validator = withZod(defaultHiddenFields)

export async function action({ request }: ActionFunctionArgs) {
  const form = await validator.validate(await request.formData())

  if (form.error) {
    return validationError(form.error)
  }

  await auth.logout(request, {
    redirectTo: form.data.location.pathname,
  })
}
