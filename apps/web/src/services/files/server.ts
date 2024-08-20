import "server-only"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import type { FileUpload } from "./shared"
import { encodeFilename, encodeUrl } from "./shared"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

export const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: String(process.env.CLOUDFLARE_R2_ACCESS_KEY_ID),
    secretAccessKey: String(process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY),
  },
})

export async function getSignedURL(params: FileUpload) {
  const filename = encodeFilename(params)
  const fileUrl = encodeUrl(params)

  const signedUrl = await getSignedUrl(
    S3,
    new PutObjectCommand({
      Bucket: "artists-together-public",
      Key: filename,
    }),
    { expiresIn: 15 * 60 },
  )

  return {
    fileUrl,
    filename,
    signedUrl,
  }
}
