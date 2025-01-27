import type { SubmissionResult } from "@conform-to/react"
import { useEffect } from "react"
import { toaster } from "~/components/Toasts"

export function useFormToastError<FormError extends string[] = string[]>(
  lastResult: SubmissionResult<FormError> | null,
) {
  useEffect(() => {
    if (lastResult && lastResult.status === "error") {
      const formError = lastResult.error?.[""]
      if (formError) {
        toaster.create({
          title: formError,
          type: "error",
        })
      }
    }
  }, [lastResult])
}
