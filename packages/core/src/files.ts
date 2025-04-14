import { AwsClient } from "aws4fetch"

export const r2 = new AwsClient({
  accessKeyId: String(process.env.CLOUDFLARE_R2_ACCESS_KEY_ID),
  secretAccessKey: String(process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY),
})
