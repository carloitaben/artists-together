import "server-only"
import type { Submission } from "@conform-to/react"
import { parseWithValibot } from "@conform-to/valibot"
import * as v from "valibot"

type SuccessfulSubmission<
  Schema,
  FormError = string[],
  FormValue = Schema,
> = Extract<Submission<Schema, FormError, FormValue>, { status: "success" }>

type FormActionContext<Schema extends v.GenericSchema> = {
  formData: FormData
  form: SuccessfulSubmission<v.InferOutput<Schema>>
}

export function createFormAction<Schema extends v.GenericSchema, Result>(
  schema: Schema,
  action: (context: FormActionContext<Schema>) => Promise<Result>,
) {
  return async function formAction(formData: FormData) {
    const form = parseWithValibot(formData, {
      schema,
    })

    if (form.status !== "success") {
      throw form.reply()
    }

    return action({
      form,
      formData,
    })
  }
}
