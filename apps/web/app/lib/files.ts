import type { SerializeFrom } from "@vercel/remix"
import { useCallback, useEffect, useState } from "react"
import { $path } from "remix-routes"
import { emit } from "~/components/Toasts"
import { useUser } from "~/hooks/loaders"
import type { loader } from "~/routes/api.file"

export const bucketUrl = {
  private: "TODO",
  public: "https://pub-a02278b3d408411aba6645978096249a.r2.dev",
}

export type Bucket = keyof typeof bucketUrl

const decodeUrlRegex = /(?<=\/)[a-z-]*(?=\/)/i

export function decodeUrl(url: string) {
  let filename: string | undefined
  let folder: string | undefined
  let bucket: Bucket | undefined
  let bucketName: Bucket

  for (bucketName in bucketUrl) {
    if (!url.startsWith(bucketUrl[bucketName])) continue
    bucket = bucketName
    filename = url.replace(bucketUrl[bucketName], "")
    folder = filename.match(decodeUrlRegex)?.[0]
  }

  if (!filename || !bucket || !folder) {
    throw Error(`Invalid url: "${url}"`)
  }

  return {
    filename,
    bucket,
    folder,
  }
}

export function encodeFilename(params: {
  filename: string
  folder: string
  userId: string
}) {
  return `${params.folder}/${params.userId}/${Date.now()}.${params.filename
    .split(".")
    .pop()}`
}

export function encodeUrl(
  params: Parameters<typeof encodeFilename>[0] & {
    bucket: Bucket
  },
) {
  return `${bucketUrl[params.bucket]}/${encodeFilename(params)}`
}

export function useFileUpload({
  bucket,
  folder,
}: {
  bucket: Bucket
  folder: string
}) {
  const [loading, setLoading] = useState(false)
  const [payload, setPayload] = useState<{ body: BodyInit; filename: string }>()
  const [filename, setFilename] = useState<string>()
  const user = useUser()

  useEffect(() => {
    if (!payload) return
    if (!user) return emit.error("Oops! Permission denied")

    setLoading(true)
    setFilename(undefined)

    const abortController = new AbortController()

    fetch(
      $path("/api/file", {
        bucket,
        folder,
        filename: payload.filename,
      }),
      {
        method: "GET",
        signal: abortController.signal,
      },
    )
      .then((response) => {
        if (!response.ok) throw Error("Invalid response")
        return response.json()
      })
      .then((json: SerializeFrom<typeof loader>) => {
        if (!json) throw Error("Invalid JSON")
        fetch(json.signedUrl, {
          method: "PUT",
          signal: abortController.signal,
          body: payload.body,
          // headers: {
          //   "Content-Type": ,
          // },
        }).then((response) => {
          if (!response.ok) throw Error("Invalid response")
          setFilename(json.fileUrl)
          setLoading(false)
        })
      })
      .catch((error) => {
        console.error(error)
        emit.error()
        setLoading(false)
      })

    return () => {
      abortController.abort()
    }
  }, [bucket, folder, payload, user])

  const upload = useCallback(
    (params: { body: BodyInit; filename: string }) => {
      if (!user) return

      const filename = encodeFilename({
        filename: params.filename,
        userId: user.userId,
        folder,
      })

      setPayload({
        body: params.body,
        filename,
      })
    },
    [folder, user],
  )

  return {
    upload,
    loading,
    filename: filename,
  }
}

export function upload(
  body: BodyInit,
  config: {
    bucket: Bucket
    folder: string
    filename: string
  },
) {
  const abortController = new AbortController()

  fetch($path("/api/file", config), {
    method: "GET",
    signal: abortController.signal,
  })
    .then((response) => {
      if (!response.ok) throw Error("Invalid response")
      return response.json()
    })
    .then((json: SerializeFrom<typeof loader>) => {
      if (!json) throw Error("Invalid JSON")
      fetch(json.signedUrl, {
        body,
        method: "PUT",
        signal: abortController.signal,
        // headers: {
        //   "Content-Type": ,
        // },
      }).then((response) => {
        if (!response.ok) throw Error("Invalid response")
      })
    })
    .catch((error) => {
      console.error(error)
      emit.error()
    })
}
