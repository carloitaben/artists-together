import type { ClientCaller } from "next-safe-action"
import type { ZodTypeAny, AnyZodObject, TypeOf } from "zod"
import type { FunctionComponent } from "react"
import type { Path, SubmitHandler, UseFormProps } from "react-hook-form"
import { useForm as useHookForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

export type PropsWithAction<T> = { action: T }

export function withAction<P extends { action: any }, Z extends ZodTypeAny, D>(
  Component: FunctionComponent<P>,
  action: ClientCaller<Z, D>
) {
  return function ComponentWithAction(props: Omit<P, "action">) {
    const allProps = { ...props, action } as P
    return <Component {...allProps} />
  }
}

export function useForm<T extends AnyZodObject, D>({
  action,
  schema,
  onError,
  onSubmit,
  ...props
}: Omit<UseFormProps<TypeOf<T>>, "resolver"> & {
  action: ClientCaller<T, D>
  schema: T
  onError: () => void
  onSubmit: (data: D, input: TypeOf<T>) => void
}) {
  type Schema = TypeOf<typeof schema>

  const form = useHookForm<Schema>({
    ...props,
    resolver: zodResolver(schema),
  })

  const keys = schema.keyof()

  const submit: SubmitHandler<Schema> = async (input) => {
    const { data, serverError, validationError } = await action(input)

    if (validationError) {
      return Object.entries(validationError).forEach(([name, error]) => {
        if (keys.safeParse(name).success && typeof name === "string") {
          const message = Array.isArray(error) ? error[0] : "Unknown error"
          form.setError(name as Path<TypeOf<T>>, { message })
        } else {
          form.setError("root", { message: "Unhandled field error" })
        }
      })
    }

    if (serverError) {
      return onError()
    }

    if (!data) {
      return onError()
    }

    return onSubmit(data, input)
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
