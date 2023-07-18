"use client"

import { ReactNode } from "react"
import { FormProvider } from "react-hook-form"

type Props = {
  form: any
  submit: any
  children: ReactNode
}

export default function Form({ form, submit, children }: Props) {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(submit)}>{children}</form>
    </FormProvider>
  )
}
