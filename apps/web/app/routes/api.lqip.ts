import type { LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { z } from "zod"
import { zfd } from "zod-form-data"
import { getRemoteLQIP } from "~/server/files.server"
import { getSearchParams } from "~/lib/params"

const searchParams = z.object({
  url: zfd.text(z.string().url()),
})

export type SearchParams = z.infer<typeof searchParams>

export async function loader({ request }: LoaderFunctionArgs) {
  const params = getSearchParams(request, searchParams)

  if (!params.success) {
    return json(null, {
      status: 400,
      statusText: "Invalid search params",
    })
  }

  try {
    const placeholder = await getRemoteLQIP(params.data.url)
    return json(placeholder)
  } catch (error) {
    console.error(error)
    return json(null, {
      status: 500,
    })
  }
}
