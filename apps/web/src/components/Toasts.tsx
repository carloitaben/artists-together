import { rootRouteId, useNavigate, useSearch } from "@tanstack/react-router"
import { Toast, Toaster, createToaster } from "@ark-ui/react/toast"
import { useEffect } from "react"
import { cx } from "cva"
import Icon from "./Icon"

export const toaster = createToaster({
  placement: "bottom",
  overlap: false,
  max: 3,
})

export default function Toasts() {
  const navigate = useNavigate()
  const search = useSearch({
    from: rootRouteId,
    select: ({ error, toast }) => ({ error, toast }),
  })

  useEffect(() => {
    if (
      typeof search.toast === "undefined" &&
      typeof search.error === "undefined"
    )
      return

    toaster.create({
      title: search.toast || search.error || "Oops! Something went wrong…",
      type: search.error ? "error" : "info",
    })

    navigate({
      replace: true,
      // @ts-expect-error I don't know how to solve this
      search: (prev) => ({
        ...prev,
        toast: undefined,
        error: undefined,
      }),
    })
  }, [navigate, search.error, search.toast])

  return (
    <Toaster toaster={toaster}>
      {(toast) => (
        <Toast.Root
          key={toast.id}
          className={cx(
            "z-[--z-index] translate-y-[--y] opacity-[--opacity]",
            "flex items-center justify-center whitespace-nowrap rounded-full bg-not-so-white pl-6 text-sm text-gunpla-white-700 shadow-button transition-all",
            "selection:bg-gunpla-white-300 selection:text-gunpla-white-900",
          )}
        >
          {toast.title ? <Toast.Title>{toast.title}</Toast.Title> : null}
          {toast.description ? (
            <Toast.Description>{toast.description}</Toast.Description>
          ) : null}
          <Toast.CloseTrigger className="grid size-12 place-items-center">
            <Icon src="Close" alt="Close" className="size-4" />
          </Toast.CloseTrigger>
        </Toast.Root>
      )}
    </Toaster>
  )
}
