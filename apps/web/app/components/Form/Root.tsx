import { useLocation } from "@remix-run/react"
import type { Routes } from "remix-routes"
import type { FormProps } from "remix-validated-form"
import { ValidatedForm } from "remix-validated-form"

type Props<
  DataType extends {
    [fieldName: string]: any
  },
  Subaction extends string | undefined
> = Omit<FormProps<DataType, Subaction>, "action"> & {
  action: keyof Routes
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
  ...props
}: Props<DataType, Subaction>) {
  const location = useLocation()

  return (
    <ValidatedForm
      {...props}
      fetcherKey={action}
      validator={validator}
      method={method}
      action={action}
    >
      <input type="hidden" name="location.pathname" value={location.pathname} />
      <input type="hidden" name="location.key" value={location.key} />
      {children}
    </ValidatedForm>
  )
}
