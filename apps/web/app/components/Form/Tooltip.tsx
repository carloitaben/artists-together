import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cx } from "cva"
import type { ReactNode } from "react"
import Icon from "~/components/Icon"

type Props = {
  children: ReactNode
  align: "start" | "end"
}

export default function Tooltip({ children, align }: Props) {
  return (
    <TooltipPrimitive.Root delayDuration={0}>
      <TooltipPrimitive.Trigger
        type="button"
        className={cx(
          "flex items-center justify-center text-gunpla-white-500 p-2",
          { "-ml-2": align === "start", "-mr-2": align === "end" },
        )}
      >
        <Icon name="info" alt="Info" className="w-3.5 h-3.5" />
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          align={align}
          side="bottom"
          className={cx("", {
            "-translate-x-full": align === "start",
            "": align === "end",
          })}
        >
          <div
            className={cx(
              "w-full max-w-[15rem] rounded-b-2xl bg-gunpla-white-500 px-4 py-3 text-gunpla-white-50 shadow-card",
              {
                "rounded-tr-sm rounded-tl-2xl": align === "start",
                "rounded-tl-sm rounded-tr-2xl": align === "end",
              },
            )}
          >
            {children}
          </div>
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}
