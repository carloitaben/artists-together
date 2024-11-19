import type { HTMLArkProps } from "@ark-ui/react/factory"
import { ark } from "@ark-ui/react/factory"
import { animate } from "motion/react"
import type { ComponentRef, ForwardedRef, MouseEvent } from "react"
import { forwardRef, useCallback } from "react"

function pxToNumber(px: string) {
  const match = px.match(/\d+/)?.[0]
  return match ? parseInt(match) : 0
}

export function anchor(event: MouseEvent, href?: string) {
  const root =
    event.currentTarget.closest('[class*="overflow-"]') ||
    document.documentElement

  const scrollPadding = pxToNumber(getComputedStyle(root).scrollPadding)
  const target = href ? document.querySelector(href) : document.documentElement

  if (!target) {
    throw Error(`Expected target to exist for href "${href}"`)
  }

  const to = target.getBoundingClientRect().top

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

type Props = HTMLArkProps<"a">

function Anchor(
  { href, onClick, ...props }: Props,
  ref: ForwardedRef<ComponentRef<"a">>,
) {
  const scroll = useCallback<NonNullable<Props["onClick"]>>(
    (event) => {
      onClick?.(event)
      if (!event.defaultPrevented) {
        event.preventDefault()
        anchor(event, href)
      }
    },
    [href, onClick],
  )

  return <ark.a {...props} ref={ref} href={href} onClick={scroll} />
}

export default forwardRef(Anchor)
