import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { z } from "zod"
import { auth } from "~/server/auth.server"
import { getSearchParams } from "~/lib/params"
import { withZod } from "@remix-validated-form/with-zod"
import { validationError } from "remix-validated-form"
import { getSignedUrl, remove } from "~/server/files.server"

const searchParams = z.object({
  bucket: z.union([z.literal("private"), z.literal("public")]),
  folder: z.string(),
  filename: z.string(),
})

export type SearchParams = z.infer<typeof searchParams>

export async function loader({ request }: LoaderFunctionArgs) {
  const params = getSearchParams(request, searchParams)

  if (!params.success) {
    return json(null, {
      status: 400,
      statusText: "Invalid Params",
    })
  }

  const authRequest = await auth.handleRequest(request).validate()

  if (!authRequest) {
    return json(null, {
      status: 401,
    })
  }

  try {
    const payload = await getSignedUrl({
      userId: authRequest.user.userId,
      bucket: params.data.bucket,
      folder: params.data.folder,
      filename: params.data.filename,
    })

    return json(payload)
  } catch (error) {
    console.error(error)
    return json(null, {
      status: 500,
    })
  }
}

const deleteActionValidator = withZod(
  z.object({
    url: z.string().url(),
  }),
)

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "DELETE") {
    return json(null, {
      status: 405,
    })
  }

  const authRequest = await auth.handleRequest(request).validate()

  if (!authRequest) {
    return json(null, {
      status: 401,
    })
  }

  const form = await deleteActionValidator.validate(await request.formData())

  if (form.error) {
    return validationError(form.error)
  }

  try {
    await remove(form.data.url)
    return json(null, {
      status: 200,
    })
  } catch (error) {
    console.error(error)
    return json(null, {
      status: 500,
    })
  }
}
