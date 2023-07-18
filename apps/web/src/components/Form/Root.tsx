"use client"

import * as RadixTooltip from "@radix-ui/react-tooltip"
import { ForwardedRef, ReactNode, forwardRef, useCallback } from "react"
import { Form, Formik, FormikConfig } from "formik"
import { AnyZodObject, TypeOf } from "zod"
import { toFormikValidationSchema } from "zod-formik-adapter"

import { useToast } from "../Toast"
import { wait } from "~/lib/utils"

const DEFAULT_DELAY_VALUE_MS = 750

type Props<T extends AnyZodObject> = FormikConfig<TypeOf<T>> & {
  schema: T
  children: ReactNode
  /**
   * Adds an artificial minimum duration to the `obSubmit` call
   *
   * ```tsx
   * <Root delay /> // Default duration
   * <Root delay={0.5} /> // 500ms
   * ```
   */
  delay?: number | true
}

function Root<T extends AnyZodObject>(
  { children, schema, initialValues, onSubmit, delay = 0, ...props }: Props<T>,
  ref: ForwardedRef<HTMLFormElement>
) {
  const emit = useToast()

  const submit = useCallback<Props<T>["onSubmit"]>(
    async (values, helpers) => {
      try {
        await Promise.all([
          onSubmit(values, helpers),
          delay &&
            wait(
              typeof delay === "number" ? delay * 1000 : DEFAULT_DELAY_VALUE_MS
            ),
        ])

        helpers.setSubmitting(false)
      } catch (error) {
        if (process.env.NODE_ENV !== "production") console.error(error)

        let title = "Oops! That didn't work"

        if (error instanceof Error) {
          title = error.message
        } else if (typeof error === "string") {
          title = error
        }

        emit(title)
      }
    },
    [delay, emit, onSubmit]
  )

  return (
    <Formik
      {...props}
      initialValues={initialValues}
      onSubmit={submit}
      ref={ref}
      validationSchema={toFormikValidationSchema(schema)}
    >
      <Form>
        <RadixTooltip.Provider>{children}</RadixTooltip.Provider>
      </Form>
    </Formik>
  )
}

export default forwardRef(Root)
