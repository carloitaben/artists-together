import "server-only"
import * as v from "valibot"
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies"
import { cookies as getCookies } from "next/headers"
import { parseWithValibot } from "conform-to-valibot"
import type { Submission, SubmissionResult } from "@conform-to/react"
import { AnyJSONString, JSONStringify } from "@artists-together/core/schemas"

export function createCookie<
  Name extends string,
  Schema extends v.GenericSchema,
>({
  name,
  schema,
  ...defaultOptions
}: Partial<ResponseCookie> & {
  name: Name
  schema: Schema
}) {
  const encodeSchema = v.pipe(schema, JSONStringify)
  const decodeSchema = v.pipe(AnyJSONString, schema)
  const encode = v.parser(encodeSchema)
  const decode = v.safeParser(decodeSchema)

  return async function cookie() {
    const cookies = await getCookies()

    return {
      name,
      get() {
        return decode(cookies.get(name)?.value)
      },
      set(value: v.InferInput<Schema>, options?: Partial<ResponseCookie>) {
        const encoded = encode(value)
        return cookies.set(name, encoded, {
          ...defaultOptions,
          ...options,
        })
      },
      delete(options?: Omit<ResponseCookie, "value" | "expires">) {
        return cookies.delete({
          ...defaultOptions,
          ...options,
          name,
        })
      },
    }
  }
}

type SuccessfulSubmission<
  Schema,
  FormError = string[],
  FormValue = Schema,
> = Extract<Submission<Schema, FormError, FormValue>, { status: "success" }>

export type FormActionResult<FormError extends string[] = string[]> = {
  result: SubmissionResult<FormError>
}

type FormActionContext<
  Schema extends v.GenericSchema,
  FormError extends string[] = string[],
> = {
  lastResult: FormActionResult<FormError> | null
  formData: FormData
  form: SuccessfulSubmission<v.InferOutput<Schema>>
}

export function createFormAction<
  const Result extends void | FormActionResult<FormError>,
  Schema extends v.GenericSchema,
  FormError extends string[] = string[],
>(
  schema: Schema,
  action: (context: FormActionContext<Schema, FormError>) => Promise<Result>,
) {
  return async function formAction(
    lastResult: FormActionResult<FormError> | null,
    formData: FormData,
  ) {
    const form = parseWithValibot(formData, {
      schema,
    })

    if (form.status !== "success") {
      return {
        result: form.reply(),
      }
    }

    const result = await action({
      form,
      formData,
      lastResult,
    })

    if (typeof result !== "undefined") {
      return result
    }

    return {
      result: form.reply(),
    }
  }
}
