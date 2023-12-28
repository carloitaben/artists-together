import * as AspectRatio from "@radix-ui/react-aspect-ratio"
import type { SerializeFrom } from "@remix-run/node"
import { useControlField, useFormContext } from "remix-validated-form"
import { $path } from "remix-routes"
import { cx } from "cva"
import type { ComponentProps, ForwardedRef } from "react"
import { forwardRef, useCallback, useEffect, useState } from "react"
import { flushSync } from "react-dom"
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

function formatFile(uri?: string) {
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
  const { submit } = useFormContext()
  const [value = "", setValue] = useControlField<string>(name)
  const [file, setFile] = useState<File>()
  const [urls, setUrls] = useState<SerializeFrom<typeof loader>>()
  const [loading, setLoading] = useState(false)

  const remove = useCallback(() => {
    setFile(undefined)
    setUrls(undefined)
    setValue("")
    if (submitOnChange) submit()

    if (!value) return

    const formData = new FormData()
    formData.append("bucket", bucket)
    formData.append("url", value)

    fetch($path("/api/file"), {
      body: formData,
      method: "DELETE",
    }).catch((error) => {
      console.error(error)
      emit.error()
    })
  }, [bucket, setValue, submit, submitOnChange, value])

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

      setFile(file)
    },
    [maxFileSize, type],
  )

  useEffect(() => {
    if (!file) {
      return setLoading(false)
    }

    setLoading(true)

    const abortController = new AbortController()

    if (!urls) {
      fetch(
        $path("/api/file", {
          bucket,
          folder,
          filename: file.name,
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
          setUrls(json)
        })
        .catch((error) => {
          console.error(error)
          emit.error()
          setFile(undefined)
        })

      return () => abortController.abort()
    }

    fetch(urls.signedUrl, {
      body: file,
      method: "PUT",
      signal: abortController.signal,
      headers: {
        "Content-Type": file.type,
      },
    })
      .then((response) => {
        if (!response.ok) throw Error("Invalid response")
        flushSync(() => setValue(urls.fileUrl))
        if (submitOnChange) submit()
      })
      .catch((error) => {
        console.error(error)
        emit.error()
      })
      .finally(() => {
        setFile(undefined)
        setUrls(undefined)
      })

    return () => abortController.abort()
  }, [bucket, file, folder, setValue, submit, submitOnChange, urls])

  const format = formatFile(value)

  return (
    <>
      <input type="hidden" name={name} value={value || undefined} />
      <div
        {...props}
        ref={ref}
        className={cx(className, "overflow-hidden rounded-2xl group")}
      >
        <AspectRatio.Root ratio={1}>
          {value ? (
            <>
              <Image
                className="group-hover:invisible group-focus:invisible"
                src={value}
                alt={format.filename}
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
                  <span className="truncate" title={format.filename}>
                    {format.filename}
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
    </>
  )
}

export default forwardRef(FormFile)
