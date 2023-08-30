"use client"

import { ReactNode } from "react"
import * as RadixTooltip from "@radix-ui/react-tooltip"

import Icon from "~/components/Icon"

type Props = {
  children: ReactNode
}

export default function Tooltip({ children }: Props) {
  return (
    <RadixTooltip.Root delayDuration={0}>
      <RadixTooltip.Trigger
        type="button"
        className="absolute inset-y-0 right-0 h-10 w-10 rounded-[1rem] p-2 text-gunpla-white-500"
      >
        <Icon icon="info" label="Info" />
      </RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content align="start" side="bottom" className="ml-10">
          <div className="w-56 rounded-b-2xl rounded-tl-sm rounded-tr-2xl bg-gunpla-white-500 px-4 py-3 font-sans text-sm text-gunpla-white-50 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]">
            {children}
          </div>
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  )
}
