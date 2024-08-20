"use client"

import type {
  ComponentPropsWithoutRef,
  ComponentRef,
  ForwardedRef,
  MouseEvent,
} from "react"
import { forwardRef, useCallback } from "react"
import { animate } from "framer-motion"
import Slot from "~/components/Slot"

type Props = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  href: string
  asChild?: boolean
}

function pxToNumber(px: string) {
  const match = px.match(/\d+/)?.[0]

  if (!match) {
    throw Error(`Could not convert px to number: "${px}"`)
  }

  return parseInt(match)
}

export function anchor<T extends MouseEvent>(event: T, target?: string) {
  event.preventDefault()

  if (!(event.target instanceof Element)) {
    throw Error("Event target is not instanceof Element")
  }

  const container =
    event.target.closest('[class*="overflow-"]') || document.documentElement

  const scrollPadding = pxToNumber(getComputedStyle(container).scrollPadding)

  const to = target
    ? document.querySelector(target)!.getBoundingClientRect().top
    : 0

  animate(container.scrollTop, Math.max(to - scrollPadding, 0), {
    type: "spring",
    mass: 0.075,
    onPlay: () => window.addEventListener("scroll", event.stopPropagation),
    onComplete: () =>
      window.removeEventListener("scroll", event.stopPropagation),
    onUpdate: (top) => (container.scrollTop = top),
  })
}

function Anchor(
  { asChild, href, ...props }: Props,
  ref: ForwardedRef<ComponentRef<"a">>,
) {
  const Component = asChild ? Slot : "a"

  const scrollTo = useCallback<NonNullable<Props["onClick"]>>(
    (event) => {
      props.onClick?.(event)
      anchor(event, href)
    },
    [href, props],
  )

  return <Component {...props} ref={ref} href={href} onClick={scrollTo} />
}

export default forwardRef(Anchor)
