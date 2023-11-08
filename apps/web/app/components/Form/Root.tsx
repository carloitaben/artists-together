import { useFetcher } from "@remix-run/react"
import { withZod } from "@remix-validated-form/with-zod"
import { z } from "zod"
import type { Routes } from "remix-routes"
import type { FormProps, Validator } from "remix-validated-form"
import { ValidatedForm } from "remix-validated-form"
import { Provider } from "@radix-ui/react-tooltip"

type Props<
  DataType extends {
    [fieldName: string]: any
  },
  Subaction extends string | undefined,
> = Omit<FormProps<DataType, Subaction>, "action" | "validator"> &
  Partial<Pick<FormProps<DataType, Subaction>, "validator">> & {
    action?: keyof Routes
  }

export default function Root<
  DataType extends {
    [fieldName: string]: any
  },
  Subaction extends string | undefined,
>({
  method = "post",
  children,
  action,
  validator,
  navigate = true,
  ...props
}: Props<DataType, Subaction>) {
  const fetcher = useFetcher<DataType>()

  const validatorFallback =
    validator || (withZod(z.object({})) as Validator<DataType>)

  return (
    <ValidatedForm
      {...props}
      validator={validatorFallback}
      fetcher={navigate ? undefined : fetcher}
      navigate={navigate}
      method={method}
      action={action}
    >
      <Provider>{children}</Provider>
    </ValidatedForm>
  )
}
