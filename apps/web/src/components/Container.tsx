import type { HTMLArkProps } from "@ark-ui/react/factory"
import { ark } from "@ark-ui/react/factory"
import type { VariantProps } from "cva"
import { cva } from "cva"

export const padding = "px-1 sm:pr-4 sm:pl-0"

const variants = cva({
  base: "w-full mx-auto",
  variants: {
    padding: {
      true: padding,
      false: "",
    },
  },
  defaultVariants: {
    padding: true,
  },
})

type Props = HTMLArkProps<"div"> & VariantProps<typeof variants>

export default function Container({ className, padding, ...props }: Props) {
  return <ark.div className={variants({ className, padding })} {...props} />
}
