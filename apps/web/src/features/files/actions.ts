// "use server"

// import { DeleteObjectCommand } from "@aws-sdk/client-s3"
// import { authenticate } from "~/features/auth/server"
// import { S3, getSignedURL as getSignedURLFn } from "./server"
// import { decodeUrl } from "./shared"
// import type { FileUpload } from "./shared"
// import { error } from "~/lib/actions"

// export async function getSignedURL(params: FileUpload) {
//   const auth = await authenticate()

//   if (!auth) {
//     return error({ cause: "UNAUTHORIZED" })
//   }

//   return getSignedURLFn(params)
// }

// export async function removeFile(url: string) {
//   const auth = await authenticate()

//   if (!auth) {
//     return error({ cause: "UNAUTHORIZED" })
//   }

//   const decoded = decodeUrl(url)

//   if (auth.user.id !== decoded.userId) {
//     return error({ cause: "UNAUTHORIZED" })
//   }

//   const command = new DeleteObjectCommand({
//     Bucket: `artists-together-${decoded.bucket}`,
//     Key: decoded.filename,
//   })

//   await S3.send(command)
// }
