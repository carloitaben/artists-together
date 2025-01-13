import type { ComponentProps, ComponentRef, ForwardedRef } from "react"
import { forwardRef } from "react"

type Props = Omit<ComponentProps<"img">, "alt"> & {
  alt: string
}

function Image(
  {
    alt,
    draggable = false,
    decoding = "async",
    loading = "lazy",
    ...props
  }: Props,
  ref: ForwardedRef<ComponentRef<"img">>,
) {
  return (
    <img
      {...props}
      alt={alt}
      ref={ref}
      draggable={false}
      decoding={decoding}
      loading={loading}
    />
  )
}

export default forwardRef(Image)
