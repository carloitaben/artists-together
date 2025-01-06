import type { HTMLArkProps } from "@ark-ui/react/factory"
import { ark } from "@ark-ui/react/factory"
import { cx } from "cva"

type Props = HTMLArkProps<"div"> & {
  ratio: number
}

export default function Root({ className, ratio, style, ...props }: Props) {
  return (
    <ark.div
      className={cx("relative w-full", className)}
      style={{ ...style, paddingBottom: `${100 / ratio}%` }}
      {...props}
    />
  )
}

