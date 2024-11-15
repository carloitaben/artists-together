import type { ComponentProps, ComponentRef, ForwardedRef } from "react"
import { forwardRef } from "react"

type Props = Omit<ComponentProps<"img">, "alt"> & {
  alt: string
}

function Image(props: Props, ref: ForwardedRef<ComponentRef<"img">>) {
  return <img {...props} alt={props.alt} ref={ref} />
}

export default forwardRef(Image)
