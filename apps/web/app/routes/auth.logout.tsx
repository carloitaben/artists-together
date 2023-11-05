import { redirect, type ActionFunctionArgs } from "@remix-run/node"
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

  const authRequest = auth.handleRequest(request)
  const session = await authRequest.validate()

  if (!session) {
    return redirect(form.data.pathname)
  }

  await auth.invalidateSession(session.sessionId)
  const sessionCookie = auth.createSessionCookie(session)

  return redirect(form.data.pathname + "?toast=Logged+out+succesfully", {
    headers: {
      "Set-Cookie": sessionCookie.serialize(),
    },
  })
}
