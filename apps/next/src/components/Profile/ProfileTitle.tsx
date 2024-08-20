import type { HTMLArkProps } from "@ark-ui/react"
import { ark } from "@ark-ui/react"
import { cx } from "cva"
import type { ComponentRef, ForwardedRef } from "react"
import { forwardRef } from "react"

type Props = HTMLArkProps<"span">

function ProfileTitle(
  { className, ...props }: Props,
  ref: ForwardedRef<ComponentRef<"span">>,
) {
  return (
    <ark.span
      {...props}
      ref={ref}
      className={cx(
        "block px-3.5 font-fraunces text-[2rem]/[2.4375rem] font-light",
        className,
      )}
    />
  )
}

export default forwardRef(ProfileTitle)
