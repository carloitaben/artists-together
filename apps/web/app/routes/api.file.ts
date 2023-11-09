import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { z } from "zod"
import { auth } from "~/server/auth.server"
import { env } from "~/server/env.server"
import { getSearchParams } from "~/lib/params"

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
    const S3 = new S3Client({
      region: "auto",
      endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: String(env.CLOUDFLARE_R2_ACCESS_KEY_ID),
        secretAccessKey: String(env.CLOUDFLARE_R2_SECRET_ACCESS_KEY),
      },
    })

    const filename = `${params.data.folder}/${
      authRequest.user.userId
    }/${Date.now()}.${params.data.filename.split(".").pop()}`

    const fileUrl = `https://https://pub-a02278b3d408411aba6645978096249a.r2.dev/${filename}`

    const signedUrl = await getSignedUrl(
      S3,
      new PutObjectCommand({
        Bucket: `artists-together-${params.data.bucket}`,
        Key: filename,
      }),
      { expiresIn: 3_600 },
    )

    return json({ fileUrl, signedUrl })
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
