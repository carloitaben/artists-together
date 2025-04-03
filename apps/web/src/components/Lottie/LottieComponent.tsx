"use client"

import { cx } from "cva"
import type { AnimationConfigWithData } from "lottie-web/build/player/lottie_svg"
import lottie from "lottie-web/build/player/lottie_svg"
import type { ComponentProps, ComponentRef, RefCallback } from "react"
import { use, useCallback } from "react"

type Props = ComponentProps<"div"> &
  Pick<AnimationConfigWithData, "autoplay" | "loop"> & {
    /**
     * A dynamic import with the Lottie JSON animation
     */
    src: Promise<{ default: unknown }>
  }

export default function LottieComponent({
  src,
  className,
  autoplay = false,
  loop = false,
  ...props
}: Props) {
  const animationData = use(src)
  const ref = useCallback<RefCallback<ComponentRef<"div">>>(
    (container) => {
      if (!container) return

      const animation = lottie.loadAnimation({
        animationData: animationData.default,
        container,
        autoplay,
        loop,
      })

      return () => animation.destroy()
    },
    [animationData.default, autoplay, loop],
  )

  return (
    <div {...props} ref={ref} className={cx(className, "*:!transform-none")} />
  )
}
