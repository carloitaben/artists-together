"use client"

import type { HTMLArkProps } from "@ark-ui/react/factory"
import { ark } from "@ark-ui/react/factory"
import { useAnimate, useScroll, useSpring } from "motion/react"
import type { ComponentRef, ForwardedRef } from "react"
import { forwardRef, useEffect } from "react"
import { mergeRefs } from "react-merge-refs"
import SplitType from "split-type"
import { onMeasure } from "~/lib/media"

type Props = HTMLArkProps<"div">

function TextAnimation(props: Props, ref: ForwardedRef<ComponentRef<"div">>) {
  const [scope, animate] = useAnimate<ComponentRef<"div">>()
  const scroll = useScroll({
    target: scope,
    offset: ["start center", "end end"],
  })

  const scrollYProgress = useSpring(scroll.scrollYProgress, {
    mass: 0.15,
  })

  useEffect(() => {
    function setup() {
      const split = new SplitType(scope.current, {
        split: "words",
        wordClass: "blur-[--blur]",
      })

      if (!split.words) {
        return split.revert
      }

      const animation = animate(
        split.words.map((word) => [
          word,
          {
            opacity: [0, 1],
            "--blur": ["4px", "0px"],
          },
        ]),
        { duration: 1 },
      )

      animation.pause()
      animation.time = 0

      const cleanup = scrollYProgress.on("change", (progress) => {
        animation.time = progress
      })

      return () => {
        cleanup()
        split.revert()
      }
    }

    let width = 0
    let cleanupAnimation: VoidFunction | undefined = undefined
    const cleanupMeasure = onMeasure(scope.current, (rect) => {
      if (width === rect.width) return
      width = rect.width
      cleanupAnimation = setup()
    })

    return () => {
      cleanupAnimation?.()
      cleanupMeasure()
    }
  }, [animate, scope, scrollYProgress])

  return <ark.div {...props} ref={mergeRefs([ref, scope])} />
}

export default forwardRef(TextAnimation)
