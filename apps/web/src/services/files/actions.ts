"use server"

import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import {PutObjectCommand, } from "@aws-sdk/client-s3"
import { S3 } from "./server"

export async function getSignedURL(filename: string) {
  return getSignedUrl(
    S3,
    new PutObjectCommand({
      Bucket: "artists-together-public",
      Key: filename,
    }),
    { expiresIn: 15 * 60 },
  )
}