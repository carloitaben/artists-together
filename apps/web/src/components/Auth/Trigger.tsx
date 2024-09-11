"use client"

import { Dialog } from "@ark-ui/react"
import type { ComponentProps, ComponentRef, ForwardedRef } from "react"
import { forwardRef } from "react"
import { useHydrated } from "~/lib/react/client"

type Props = ComponentProps<typeof Dialog.Trigger>

function Trigger(props: Props, ref: ForwardedRef<ComponentRef<"form">>) {
  const hydrated = useHydrated()

  return (
    <form ref={ref}>
      <Dialog.Trigger
        type={hydrated ? "button" : "submit"}
        name="modal"
        value="auth"
        {...props}
      />
    </form>
  )
}

export default forwardRef(Trigger)
