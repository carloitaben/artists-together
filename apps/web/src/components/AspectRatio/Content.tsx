import type { HTMLArkProps } from "@ark-ui/react/factory"
import { ark } from "@ark-ui/react/factory"
import { cx } from "cva"

type Props = HTMLArkProps<"div">

export default function Content({ className, ...props }: Props) {
  return <ark.div className={cx("absolute inset-0", className)} {...props} />
}

