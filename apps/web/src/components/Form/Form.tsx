"use client"

import { Form as FormikForm } from "formik"
import { ComponentProps } from "react"

type Props = ComponentProps<typeof FormikForm>

export default function Form({ children, ...props }: Props) {
  return <FormikForm {...props}>{children}</FormikForm>
}
