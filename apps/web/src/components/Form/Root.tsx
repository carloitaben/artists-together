"use client"

import { ForwardedRef, ReactNode, forwardRef } from "react"
import { Formik, FormikConfig } from "formik"
import { AnyZodObject, TypeOf } from "zod"
import { toFormikValidationSchema } from "zod-formik-adapter"

type Props<T extends AnyZodObject> = FormikConfig<TypeOf<T>> & {
  schema: T
  children: ReactNode
}

function Root<T extends AnyZodObject>(
  { children, schema, initialValues, onSubmit, ...props }: Props<T>,
  ref: ForwardedRef<HTMLFormElement>
) {
  return (
    <Formik
      {...props}
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={toFormikValidationSchema(schema)}
    >
      {children}
    </Formik>
  )
}

export default forwardRef(Root)
