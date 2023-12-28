import type { Asset } from "db"
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"
import { getPlaiceholder } from "plaiceholder"
import { env } from "./env.server"
import { getSignedUrl as getPresignedUrl } from "@aws-sdk/s3-request-presigner"
import { decodeUrl, encodeFilename, encodeUrl } from "~/lib/files"

export const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: String(env.CLOUDFLARE_R2_ACCESS_KEY_ID),
    secretAccessKey: String(env.CLOUDFLARE_R2_SECRET_ACCESS_KEY),
  },
})

export async function getSignedUrl(params: Parameters<typeof encodeUrl>[0]) {
  const filename = encodeFilename(params)
  const fileUrl = encodeUrl(params)

  return getPresignedUrl(
    S3,
    new PutObjectCommand({
      Bucket: `artists-together-${params.bucket}`,
      Key: filename,
    }),
    { expiresIn: 3_600 },
  ).then((signedUrl) => ({ signedUrl, fileUrl }))
}

export async function remove(url: string) {
  const decoded = decodeUrl(url)
  const command = new DeleteObjectCommand({
    Bucket: `artists-together-${decoded.bucket}`,
    Key: decoded.filename,
  })

  return S3.send(command)
}

export async function makeAssetFromBuffer(
  buffer: Buffer,
  url: string,
): Promise<Asset> {
  const placeholder = await getPlaiceholder(buffer)

  return {
    base64: placeholder.base64,
    hex: placeholder.color.hex,
    width: placeholder.metadata.width,
    height: placeholder.metadata.height,
    url,
  }
}

export async function makeAssetFromRemoteUrl(url: string): Promise<Asset> {
  return fetch(url)
    .then((response) => response.arrayBuffer())
    .then((buffer) => Buffer.from(buffer))
    .then((buffer) => makeAssetFromBuffer(buffer, url))
}
