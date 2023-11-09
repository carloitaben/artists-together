import * as AspectRatio from "@radix-ui/react-aspect-ratio"
import type { SerializeFrom } from "@remix-run/node"
import { useControlField, useFormContext } from "remix-validated-form"
import { $path } from "remix-routes"
import { cx } from "cva"
import type { ComponentProps, ForwardedRef } from "react"
import { forwardRef, useCallback, useEffect, useState } from "react"
import type { SearchParams, loader } from "~/routes/api.file"
import Icon from "~/components/Icon"
import Image from "~/components/Image"
import { emit } from "~/components/Toasts"
import { useFieldContextOrThrow } from "./Field"

// https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types
const fileType = {
  image: [
    "image/apng",
    "image/gif",
    "image/jpeg",
    "image/pjpeg",
    "image/png",
    "image/webp",
  ],
}

const allFileTypes = Object.values(fileType).flatMap((values) => values)

type Props = ComponentProps<"div"> & {
  /**
   * Max file size (in bytes)
   */
  maxFileSize?: number
  submitOnChange?: boolean
  folder: string
  bucket: SearchParams["bucket"]
  type?: keyof typeof fileType
}

function formatFile(uri: string | null) {
  const filename = (uri || "").split("/").slice(-1)[0]
  const extension = filename.split(".").slice(-1)[0]
  return { filename, extension }
}

function FormFile(
  {
    className,
    maxFileSize = 1_000_000,
    submitOnChange,
    bucket,
    folder,
    type,
    ...props
  }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const { name } = useFieldContextOrThrow()
  const { submit: submitForm } = useFormContext()
  const [value, setValue] = useControlField<string | null>(name)
  const [urls, setUrls] = useState<SerializeFrom<typeof loader>>(null)
  const [asset, setAsset] = useState<{ file: File; base64: string } | null>(
    null,
  )

  const remove = useCallback(() => {
    setAsset(null)
    setValue(null)
    alert("TODO: delete from bucket")
  }, [setValue])

  const onChange = useCallback<
    NonNullable<ComponentProps<"input">["onChange"]>
  >(
    (event) => {
      const file = event.target.files?.[0]

      if (!file) return

      if (type && !fileType[type].includes(file.type)) {
        return emit.error("Oops! Invalid file type")
      }

      if (file.size > maxFileSize) {
        const format = maxFileSize.toString().length > 6 ? "MB" : "KB"
        const amount = Math.round(
          maxFileSize / (format === "MB" ? 1_000_000 : 1_000),
        )

        return emit.error(`Oops! File must be less than ${amount}${format}`)
      }

      const reader = new FileReader()

      reader.onload = (event) => {
        setAsset({
          file,
          base64: event.target!.result as string,
        })
      }

      reader.readAsDataURL(file as Blob)
    },
    [maxFileSize, type],
  )

  useEffect(() => {
    if (!asset?.file) return

    const abortController = new AbortController()

    if (!urls) {
      fetch(
        $path("/api/file", {
          bucket,
          folder,
          filename: asset.file.name,
        }),
        {
          signal: abortController.signal,
          method: "GET",
        },
      )
        .then((response) => {
          if (!response.ok) throw Error("Invalid response")
          return response.json()
        })
        .then((json: SerializeFrom<typeof loader>) => {
          if (!json) throw Error("Invalid JSON")
          setUrls(json)
        })
        .catch((error) => {
          console.error(error)
          emit.error()
        })

      return () => abortController.abort()
    }

    fetch(urls.signedUrl, {
      body: asset.file,
      signal: abortController.signal,
      method: "PUT",
      headers: {
        "Content-Type": asset.file.type,
      },
    })
      .then((response) => {
        if (!response.ok) throw Error("Invalid response")
        if (submitOnChange) submitForm()
        setValue(urls.fileUrl)
      })
      .catch((error) => {
        console.error(error)
        emit.error()
      })

    return () => abortController.abort()
  }, [asset, bucket, folder, setValue, submitForm, submitOnChange, urls])

  const optimisticValue = asset?.base64 || value
  const optimisticFormat = formatFile(asset?.file.name || value)

  return (
    <div
      {...props}
      ref={ref}
      className={cx(className, "overflow-hidden rounded-2xl group")}
    >
      <AspectRatio.Root ratio={1}>
        {optimisticValue ? (
          <>
            <Image
              className="group-hover:invisible group-focus:invisible"
              src={optimisticValue}
              alt={optimisticFormat.filename}
              fit="cover"
            />
            <div className="absolute inset-0 text-gunpla-white-50 group-hover:flex group-focus:flex hidden flex-col bg-gunpla-white-300">
              <button
                className="p-2 w-10 h-10 flex-none self-end"
                onClick={remove}
              >
                <Icon name="close" className="w-6 h-6" alt="Add file" />
              </button>
              <div className="flex-1 h-full flex items-center justify-center">
                <Icon name="info" className="w-8 h-8" alt="" />
              </div>
              <div className="flex-none h-10 flex items-center justify-center px-5">
                <span className="truncate" title={optimisticFormat.filename}>
                  {optimisticFormat.filename}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-not-so-white relative">
            <Icon name="close" className="w-8 h-8 rotate-45" alt="Add file" />
            <input
              type="file"
              className="w-full h-full absolute inset-0 file:hidden text-transparent cursor-pointer"
              accept={allFileTypes.join(", ")}
              onChange={onChange}
            />
          </div>
        )}
      </AspectRatio.Root>
    </div>
  )
}

export default forwardRef(FormFile)
