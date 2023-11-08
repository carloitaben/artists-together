import * as AspectRatio from "@radix-ui/react-aspect-ratio"
import { cx } from "cva"
import type { ComponentProps, ForwardedRef } from "react"
import type { SerializeFrom } from "@remix-run/node"
import { forwardRef, useCallback, useEffect, useReducer, useState } from "react"
import { useControlField, useField, useFormContext } from "remix-validated-form"
import { useFieldContextOrThrow } from "./Field"
import Icon from "../Icon"
import { emit } from "../Toasts"
import type { FetcherWithComponents } from "@remix-run/react"
import { useFetcher } from "@remix-run/react"
import { $path } from "remix-routes"
import type { SearchParams, loader } from "~/routes/api.file"
import { unreachable } from "~/lib/utils"

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
  | { type: "default"; data: { src: string | null } }
  | {
      type: "getting"
      data: { file: File; promises: Promise<[Response, string]> }
    }
  | {
      type: "putting"
      data: { file: File; promise: Promise<Response> }
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
        file: File
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
      const promises = Promise.all([
        fetch(
          $path("/api/file", {
            bucket: action.data.bucket,
            extension: formatFile(action.data.file.name).extension,
          }),
        ),
        readFile(action.data.file),
      ])

      return {
        type: "getting",
        data: {
          file: action.data.file,
          promises,
        },
      }
    }
    case "put": {
      console.log(action.data.url)
      const promise = fetch(action.data.url, {
        body: action.data.file,
        method: "put",
      })

      return {
        type: "putting",
        data: {
          file: action.data.file,
          promise,
        },
      }
    }
    case "end":
      return {
        type: "default",
        data: {
          src: state.type === "putting" ? action.data?.file.toString() : null,
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
  // const { submit } = useFormContext()
  // const { validate } = useField(name)
  const [value, setValue] = useControlField<string | null>(name)
  // const [file, setFile] = useState<File>()
  // const [preview, setPreview] = useState(value)

  const [state, dispatch] = useReducer(reducer, {
    type: "default",
    data: { src: value },
  })

  // const optimisticValue = preview || value
  // const format = formatFile(file ? file.name : value)

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

      // const reader = new FileReader()
      // reader.onload = () => {
      // setFile(file)
      // setPreview(
      //   typeof event.target?.result === "string" ? event.target.result : null,
      // )
      // }

      // reader.readAsDataURL(file as Blob)
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
        state.data.promises
          .then([])
          .then((response) => {
            if (!response.ok) throw Error("Invalid response")
            return response.json()
          })
          .then((url: SerializeFrom<typeof loader>) => {
            if (!url) throw Error("Missing url")
            dispatch({
              type: "put",
              data: {
                url,
                file: state.data.file,
              },
            })
          })
          .catch((error) => {
            console.error(error)
            emit.error()
            dispatch({
              type: "end",
              data: null,
            })
          })
        break
      case "putting":
        state.data.promise
          .then((response) => {
            if (!response.ok) emit.error()
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
  }, [state])

  return (
    <div
      {...props}
      ref={ref}
      className={cx(className, "overflow-hidden rounded-2xl group")}
    >
      <AspectRatio.Root ratio={1}>
        {state.data.src ? (
          <>
            <img
              className="w-full h-full object-cover group-hover:invisible group-focus:invisible"
              src={state.data.src}
              alt="TODO"
              loading="lazy"
              decoding="async"
              draggable={false}
            />
            <div
              title={formatFile(state.data.src).extension}
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
                <span className="truncate">
                  {formatFile(state.data.src).extension}
                </span>
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