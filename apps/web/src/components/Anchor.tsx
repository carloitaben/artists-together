"use client"

import type { HTMLArkProps } from "@ark-ui/react/factory"
import { ark } from "@ark-ui/react/factory"
import { animate } from "framer-motion"
import type { ComponentRef, ForwardedRef, MouseEvent } from "react"
import { forwardRef, useCallback } from "react"

type Props = HTMLArkProps<"a">

function pxToNumber(px: string) {
  const match = px.match(/\d+/)?.[0]

  if (!match) {
    throw Error(`Could not convert px to number: "${px}"`)
  }

  return parseInt(match)
}

export function anchor(event: MouseEvent, href?: string) {
  event.preventDefault()

  if (!(event.target instanceof Element)) {
    throw Error("Expected event target to be an Element instance")
  }

  const root =
    event.target.closest('[class*="overflow-"]') || document.documentElement

  const scrollPadding = pxToNumber(getComputedStyle(root).scrollPadding)

  let to = 0

  if (href) {
    const target = document.querySelector(href)

    if (!target) {
      throw Error("Expected href target to exist")
    }

    to = target.getBoundingClientRect().top
  }

  function stop() {
    animation.stop()
  }

  const animation = animate(
    root.scrollTop,
    Math.min(
      root.scrollTop + to - scrollPadding,
      root.scrollHeight - root.clientHeight,
    ),
    {
      type: "spring",
      mass: 0.075,
      onPlay: () => window.addEventListener("wheel", stop),
      onComplete: () => window.removeEventListener("wheel", stop),
      onUpdate: (top) => {
        root.scrollTop = top
      },
    },
  )
}

function Anchor(
  { href, onClick, ...props }: Props,
  ref: ForwardedRef<ComponentRef<"a">>,
) {
  const scroll = useCallback<NonNullable<Props["onClick"]>>(
    (event) => {
      onClick?.(event)
      if (!event.defaultPrevented) anchor(event, href)
    },
    [href, onClick],
  )

  return <ark.a ref={ref} href={href} onClick={scroll} {...props} />
}

export default forwardRef(Anchor)
