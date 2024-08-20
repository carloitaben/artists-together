"use client"

import lottie from "lottie-web/build/player/lottie_svg"
import type { AnimationConfigWithData } from "lottie-web/build/player/lottie_svg"
import type { ComponentPropsWithoutRef } from "react"
import { use } from "react"
import { cx } from "cva"

type Props = ComponentPropsWithoutRef<"div"> &
  Pick<AnimationConfigWithData, "autoplay" | "loop"> & { src: Promise<unknown> }

export default function LottieComponent({
  src,
  className,
  autoplay = false,
  loop = false,
  ...props
}: Props) {
  const animationData = use(src)

  return (
    <div
      {...props}
      ref={(container) => {
        if (!container) return

        const animation = lottie.loadAnimation({
          container,
          animationData,
          autoplay,
          loop,
        })

        return () => animation.destroy()
      }}
      className={cx(className, "*:!transform-none")}
    />
  )
}
