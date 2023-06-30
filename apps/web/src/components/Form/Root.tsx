"use client"

import { ForwardedRef, ReactNode, forwardRef } from "react"
import { AnyZodObject, infer as Infer } from "zod"
import { Formik, FormikConfig, Form } from "formik"
import { toFormikValidationSchema } from "zod-formik-adapter"

type Props<T extends AnyZodObject> = FormikConfig<Infer<T>> & {
  schema: AnyZodObject
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
      <Form>{children}</Form>
    </Formik>
  )
}

export default forwardRef(Root)
