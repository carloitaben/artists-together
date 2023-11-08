import type { SerializeFrom } from "@remix-run/node"
import type { VariantProps } from "cva"
import { cva } from "cva"
import type { ComponentProps, ForwardedRef } from "react"
import { forwardRef } from "react"
import type { loader } from "~/routes/api.lqip"

const image = cva({
  base: "[text-indent:-100000px]",
  variants: {
    fit: {
      cover: "w-full h-full object-cover",
      contain: "w-full h-full object-contain",
      fill: "w-full h-full object-fill",
      false: "",
    },
  },
  defaultVariants: {
    fit: false,
  },
})

type Props = ComponentProps<"img"> &
  VariantProps<typeof image> & {
    lqip?: SerializeFrom<typeof loader>
  }

function Image(
  {
    src,
    alt,
    fit = false,
    lqip,
    className,
    loading = "lazy",
    decoding = "async",
    draggable = false,
    width,
    height,
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

  if (import.meta.env.DEV) {
    if (!lqip && !fit && (!width || !height)) {
      console.warn(
        "Detected image without width or height attributes. " +
          "Consider adding either a LQIP, setting a fit prop, or manually adding both width and height attributes " +
          "to the image with the following src " +
          src,
      )
    }
  }

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
      className={image({ className, fit })}
      width={width || lqip?.metadata.width}
      height={height || lqip?.metadata.height}
    />
  )
}

export default forwardRef(Image)
