import * as AspectRatio from "@radix-ui/react-aspect-ratio"
import type { SerializeFrom } from "@remix-run/node"
import { useControlField, useFormContext } from "remix-validated-form"
import { $path } from "remix-routes"
import { cx } from "cva"
import type { ComponentProps, ForwardedRef } from "react"
import { forwardRef, useCallback, useEffect, useReducer, useState } from "react"
import type { SearchParams, loader } from "~/routes/api.file"
import { unreachable } from "~/lib/utils"
import Icon from "~/components/Icon"
import Image from "~/components/Image"
import { emit } from "~/components/Toasts"
import { useFieldContextOrThrow } from "./Field"

type Props = ComponentProps<"div"> & {
  /**
   * Max file size (in bytes)
   */
  maxFileSize?: number
  submitOnChange?: boolean
  bucket: SearchParams["bucket"]
}

// https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types
const fileTypes = [
  "image/apng",
  "image/gif",
  "image/jpeg",
  "image/pjpeg",
  "image/png",
  "image/webp",
]

function formatFile(uri: string | null) {
  const filename = (uri || "").split("/").slice(-1)[0]
  const extension = filename.split(".").slice(-1)[0]
  return { filename, extension }
}

type State =
  | {
      type: "default"
      data: {
        file: null
        src: string | null
        promise: null
      }
    }
  | {
      type: "getting"
      data: {
        file: File
        src: Promise<string>
        promise: Promise<Response>
      }
    }
  | {
      type: "putting"
      data: {
        file: File
        src: Promise<string> | string | null
        promise: Promise<Response>
      }
    }

type Action =
  | {
      type: "get"
      data: {
        bucket: Props["bucket"]
        file: File
      }
    }
  | {
      type: "put"
      data: {
        url: string
      }
    }
  | { type: "end"; data: null }

async function readFile(file: File) {
  return new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onload = (event) => resolve(event.target!.result as string)
    reader.readAsDataURL(file as Blob)
  })
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "get": {
      const src = readFile(action.data.file)

      const promise = fetch(
        $path("/api/file", {
          bucket: action.data.bucket,
          extension: formatFile(action.data.file.name).extension,
        }),
      )

      return {
        type: "getting",
        data: {
          src,
          promise,
          file: action.data.file,
        },
      }
    }
    case "put": {
      if (!state.data.file) throw Error("Missing file")

      const promise = fetch(action.data.url, {
        body: state.data.file,
        method: "put",
      })

      return {
        type: "putting",
        data: {
          ...state.data,
          promise,
        },
      }
    }
    case "end":
      return {
        type: "default",
        data: {
          src: typeof state.data.src === "string" ? state.data.src : null,
          file: null,
          promise: null,
        },
      }
    default:
      unreachable(action)
  }
}

function FormFile(
  {
    className,
    maxFileSize = 1_000_000,
    bucket,
    submitOnChange,
    ...props
  }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const { name } = useFieldContextOrThrow()
  const { submit } = useFormContext()
  const [value, setValue] = useControlField<string | null>(name)
  const [preview, setPreview] = useState(value)

  const [state, dispatch] = useReducer(reducer, {
    type: "default",
    data: {
      file: null,
      promise: null,
      src: value,
    },
  } satisfies State)

  const optimisticValue = preview || value
  const optimisticFormat = formatFile(optimisticValue)

  const onChange = useCallback<NonNullable<Props["onChange"]>>(
    (event) => {
      props.onChange?.(event)

      if (!(event.target instanceof HTMLInputElement)) return

      const file = event.target.files?.item(0)

      if (!file) return

      if (file.size > maxFileSize) {
        const format = maxFileSize.toString().length > 6 ? "MB" : "KB"
        const amount = Math.round(
          maxFileSize / (format === "MB" ? 1_000_000 : 1_000),
        )

        return emit.error(`Oops! File must be less than ${amount}${format}`)
      }

      dispatch({
        type: "get",
        data: {
          bucket,
          file,
        },
      })
    },
    [bucket, maxFileSize, props],
  )

  const remove = useCallback(() => {
    // setPreview(null)
    // setValue(null)
    alert("WIP")
  }, [])

  useEffect(() => {
    switch (state.type) {
      case "default":
        break
      case "getting":
        state.data.src.then((src) => setPreview(src)).catch(() => emit.error())
        state.data.promise
          .then((response) => {
            if (!response.ok) throw Error("Invalid response")
            return response.json()
          })
          .then((url: SerializeFrom<typeof loader>) => {
            if (!url) throw Error("Missing url")
            dispatch({ type: "put", data: { url } })
          })
          .catch((error) => {
            console.error(error)
            emit.error()
            dispatch({ type: "end", data: null })
          })
        break
      case "putting":
        state.data.promise
          .then((response) => {
            if (!response.ok) emit.error()
            setValue("TODO_FILE_URL_FROM_BUCKET_GOES_HERE")
            console.log("do something here to get the r2 READ file link")
            console.log(
              "with the r2 READ file link, we should get a plaiceholder base64 url here, maybe GETing /api/file/{fileURL}",
            )
            if (submitOnChange) submit()
          })
          .catch((error) => {
            console.error(error)
            emit.error()
          })
          .finally(() =>
            dispatch({
              type: "end",
              data: null,
            }),
          )
        break
      default:
        unreachable(state)
    }
  }, [setValue, state, submit, submitOnChange])

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
              alt="TODO"
              fit="cover"
            />
            <div
              title={optimisticFormat.filename}
              className="absolute inset-0 text-gunpla-white-50 group-hover:flex group-focus:flex hidden flex-col bg-gunpla-white-300"
            >
              <button
                className="p-2 w-10 h-10 flex-none self-end"
                onClick={remove}
              >
                <Icon name="close" className="w-6 h-6" label="Add file" />
              </button>
              <div className="flex-1 h-full flex items-center justify-center">
                <Icon name="info" className="w-8 h-8" label="" />
              </div>
              <div className="flex-none h-10 flex items-center justify-center px-5">
                <span className="truncate">{optimisticFormat.filename}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-not-so-white relative">
            <Icon name="close" className="w-8 h-8 rotate-45" label="Add file" />
            <input
              type="file"
              className="w-full h-full absolute inset-0 file:hidden text-transparent cursor-pointer"
              accept={fileTypes.join(", ")}
              onChange={onChange}
            />
          </div>
        )}
      </AspectRatio.Root>
    </div>
  )
}

export default forwardRef(FormFile)