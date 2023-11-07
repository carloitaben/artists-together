import type { ActionFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { withZod } from "@remix-validated-form/with-zod"
import { validationError } from "remix-validated-form"
import { z } from "zod"
import { zfd } from "zod-form-data"
import { auth } from "~/server/auth.server"

const validator = withZod(
  z.object({
    links: zfd.repeatable(
      z.array(zfd.text(z.string().url().optional())).max(5),
    ),
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

  await auth.updateUserAttributes(authRequest.user.userId, {
    links: form.data.links.filter((link) => link) as string[],
  })

  return json(null, {
    status: 200,
  })
}
