import type { TypeOf, AnyZodObject } from "zod"
import type { Path, SubmitHandler, UseFormProps } from "react-hook-form"
import { useForm as useHookForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Action } from "~/actions/zod"

export function useForm<Schema extends AnyZodObject, Result>({
  action,
  schema,
  onError,
  onSubmit,
  ...props
}: Omit<UseFormProps<TypeOf<Schema>>, "resolver"> & {
  action: Action<any, any>
  schema: Schema
  onError: () => void
  onSubmit: (data: Result, input: TypeOf<Schema>) => void
}) {
  const form = useHookForm<TypeOf<Schema>>({
    ...props,
    resolver: zodResolver(schema),
  })

  const keys = schema.keyof()

  const submit: SubmitHandler<TypeOf<Schema>> = async (input) => {
    const result = await action(input)

    if (!("error" in result)) {
      return onSubmit(result.data, input)
    }

    if (result.error.name === "VALIDATION_ERROR") {
      return Object.entries(result.error).forEach(([name, error]) => {
        if (keys.safeParse(name).success && typeof name === "string") {
          const message = Array.isArray(error) ? error[0] : "Unknown error"
          form.setError(name as Path<TypeOf<Schema>>, { message })
        } else {
          form.setError("root", { message: "Unhandled field error" })
        }
      })
    }

    if (result.error.name === "SERVER_ERROR") {
      return onError()
    }
  }

  function field(name: keyof Schema) {
    return { name }
  }

  function root() {
    return {
      ...form,
      onSubmit: form.handleSubmit(submit),
    }
  }

  return {
    ...form,
    root,
    field,
  }
}
