import { useEffect } from "react"
import { toaster } from "~/components/Toasts"
import type { FormActionResult } from "./server"

export function useFormToastError<FormError extends string[] = string[]>(
  lastResult: FormActionResult<FormError> | null,
) {
  useEffect(() => {
    if (lastResult?.result && lastResult.result.status === "error") {
      const formError = lastResult.result.error?.[""]
      if (formError) {
        toaster.create({
          title: formError,
          type: "error",
        })
      }
    }
  }, [lastResult])
}
