import type { SerializeFrom } from "@vercel/remix"
import type { VariantProps } from "cva"
import { cva } from "cva"
import type { ComponentProps, ForwardedRef } from "react"
import { forwardRef } from "react"
import type { Asset } from "db"

const image = cva({
  base: "[text-indent:-100000px] select-none",
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

type Props = Omit<ComponentProps<"img">, "src" | "alt"> &
  VariantProps<typeof image> & {
    src: string | Asset | SerializeFrom<Asset>
    alt: string
  }

function Image(
  {
    src,
    alt,
    fit = false,
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
  const asset = typeof src === "string" ? undefined : src

  if (import.meta.env.DEV) {
    if (!asset && !fit && (!width || !height)) {
      console.warn(
        "Detected image without width or height attributes. " +
          "Consider passing an Asset as src, setting a fit prop, or manually adding both width and height attributes " +
          "to the image with the following src: " +
          src,
      )
    }
  }

  const styles = asset
    ? {
        ...style,
        backgroundImage: `url(${asset.base64})`,
        backgroundSize: "cover",
      }
    : style

  return (
    <img
      {...props}
      ref={ref}
      src={typeof src === "string" ? src : src.url}
      alt={alt}
      style={styles}
      loading={loading}
      decoding={decoding}
      draggable={draggable}
      className={image({ className, fit })}
      width={width || asset?.width}
      height={height || asset?.height}
    />
  )
}

export default forwardRef(Image)
