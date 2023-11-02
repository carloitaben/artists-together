import type { ActionFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { withZod } from "@remix-validated-form/with-zod"
import { zfd } from "zod-form-data"
import { z } from "zod"

export const validator = withZod(
  z.object({
    email: zfd.text(z.string().email()),
    switch: zfd.checkbox(),
  }),
)

export async function action({ request }: ActionFunctionArgs) {
  const form = await validator.validate(await request.formData())

  console.log(JSON.stringify(form, null, 2))

  return json(form)
}
