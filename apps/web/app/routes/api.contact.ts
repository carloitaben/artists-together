import type { ActionFunctionArgs } from "@vercel/remix"
import { json } from "@vercel/remix"
import { withZod } from "@remix-validated-form/with-zod"
import { validationError } from "remix-validated-form"
import { z } from "zod"
import { zfd } from "zod-form-data"
import { auth } from "~/server/auth.server"

export const validator = withZod(
  z.object({
    subject: zfd.text(z.string().min(1)),
    message: zfd.text(z.string().min(1).max(300)),
  }),
)

export async function action({ request }: ActionFunctionArgs) {
  const authRequest = await auth.handleRequest(request).validate()

  if (!authRequest) {
    return json(null, {
      status: 400,
    })
  }

  const form = await validator.validate(await request.formData())

  if (form.error) {
    return validationError(form.error)
  }

  console.log("should contact support with the following data", {
    data: form.data,
    user: authRequest.user,
  })

  return json(null, {
    status: 200,
  })
}
