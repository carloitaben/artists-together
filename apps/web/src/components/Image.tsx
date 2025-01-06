import type { ComponentProps } from "react"

type Props = Omit<ComponentProps<"img">, "alt"> & {
  alt: string
}

export default function Image({
  alt,
  draggable = false,
  decoding = "async",
  loading = "lazy",
  ...props
}: Props) {
  return (
    <img
      {...props}
      alt={alt}
      draggable={false}
      decoding={decoding}
      loading={loading}
    />
  )
}
