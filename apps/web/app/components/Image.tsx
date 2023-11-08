import type { SerializeFrom } from "@remix-run/node"
import type { ComponentProps, ForwardedRef } from "react"
import { forwardRef } from "react"
import type { loader } from "~/routes/api.lqip"

type Props = ComponentProps<"img"> & {
  lqip?: SerializeFrom<typeof loader>
}

function Image(
  {
    src,
    alt,
    lqip,
    className,
    loading = "lazy",
    decoding = "async",
    draggable = false,
    style = {},
    ...props
  }: Props,
  ref: ForwardedRef<HTMLImageElement>,
) {
  const styles = lqip
    ? {
        ...style,
        backgroundImage: `url(${lqip.base64})`,
        backgroundSize: "cover",
      }
    : style

  return (
    <img
      {...props}
      ref={ref}
      src={src}
      alt={alt}
      style={styles}
      loading={loading}
      decoding={decoding}
      draggable={draggable}
    />
  )
}

export default forwardRef(Image)
