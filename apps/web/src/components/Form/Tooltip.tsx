"use client"

import { ReactNode } from "react"
import * as RadixTooltip from "@radix-ui/react-tooltip"

import Icon from "~/components/Icon"
import { info } from "~/components/Icons"

type Props = {
  children: ReactNode
}

export default function Tooltip({ children }: Props) {
  return (
    <RadixTooltip.Root delayDuration={0}>
      <RadixTooltip.Trigger
        type="button"
        className="absolute inset-y-0 right-0 h-10 w-10 p-2 text-gunpla-white-500"
      >
        <Icon label="Info">{info}</Icon>
      </RadixTooltip.Trigger>
      <RadixTooltip.Content
        align="start"
        alignOffset={40}
        side="bottom"
        className="ml-16"
      >
        <div className="w-56 rounded-b-2xl rounded-tl-sm rounded-tr-2xl bg-gunpla-white-500 px-4 py-3 font-sans text-sm text-gunpla-white-50">
          {children}
        </div>
      </RadixTooltip.Content>
    </RadixTooltip.Root>
  )
}
