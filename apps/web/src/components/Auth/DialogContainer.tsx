import type { HTMLArkProps } from "@ark-ui/react/factory"
import { ark } from "@ark-ui/react/factory"
import { cx } from "cva"

type Props = HTMLArkProps<"div">

export default function DialogContainer({ className, ...props }: Props) {
  return (
    <ark.div
      {...props}
      className={cx(
        "rounded-6 bg-gunpla-white-50 text-gunpla-white-500 shadow-card",
        className,
      )}
    />
  )
}

