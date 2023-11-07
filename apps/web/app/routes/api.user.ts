import type { ActionFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { withZod } from "@remix-validated-form/with-zod"
import { validationError } from "remix-validated-form"
import { z } from "zod"
import { zfd } from "zod-form-data"
import { auth } from "~/server/auth.server"

export const validator = withZod(
  z.object({
    bio: zfd.text(z.string().max(128).nullable().default(null)),
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

  console.log(form)

  if (form.error) {
    return validationError(form.error)
  }

  await auth.updateUserAttributes(authRequest.user.userId, {
    links: form.data.links.filter((link) => link) as string[],
    bio: form.data.bio,
  })

  return json(null, {
    status: 200,
  })
}
