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
  navigate,
  ...props
}: Props<DataType, Subaction>) {
  const location = useLocation()

  return (
    <ValidatedForm
      {...props}
      fetcherKey={navigate ? undefined : action}
      validator={validator}
      navigate={navigate}
      method={method}
      action={action}
    >
      <input type="hidden" name="pathname" value={location.pathname} />
      {children}
    </ValidatedForm>
  )
}
