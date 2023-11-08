import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { auth } from "~/server/auth.server"
import { z } from "zod"
import { getParams } from "~/lib/params"
import { env } from "~/lib/env"

const searchParams = z.object({
  bucket: z.union([z.literal("avatar"), z.literal("support")]),
  extension: z.string(),
})

export type SearchParams = z.infer<typeof searchParams>

export async function loader({ request }: LoaderFunctionArgs) {
  console.log("loader file api endpoint")
  const params = getParams(request, searchParams)

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

  console.log("creating url")

  try {
    const S3 = new S3Client({
      region: "auto",
      endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      },
    })

    const filename = `${authRequest.user.userId}-${crypto.randomUUID()}.${
      params.data.extension
    }`

    const bucket = [import.meta.env.DEV ? "dev" : "", params.data.bucket]
      .filter(Boolean)
      .join("-")

    const url = await getSignedUrl(
      S3,
      new PutObjectCommand({
        Bucket: bucket,
        Key: filename,
      }),
      { expiresIn: 3_600 },
    )

    return json(url)
  } catch (error) {
    console.error(error)
    return json(null, {
      status: 500,
    })
  }
}

export async function action({ request }: ActionFunctionArgs) {
  console.log("action file", request.method)
  return null
}
