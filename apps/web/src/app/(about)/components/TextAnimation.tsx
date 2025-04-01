"use client"

import type { HTMLArkProps } from "@ark-ui/react/factory"
import { ark } from "@ark-ui/react/factory"
import { scroll, useAnimate } from "motion/react"
import type { ComponentRef, ForwardedRef } from "react"
import { forwardRef, useEffect } from "react"
import { mergeRefs } from "react-merge-refs"
import SplitType from "split-type"
import { onMeasure } from "~/lib/media"

type Props = HTMLArkProps<"div">

function TextAnimation(props: Props, ref: ForwardedRef<ComponentRef<"div">>) {
  const [scope, animate] = useAnimate<ComponentRef<"div">>()

  useEffect(() => {
    function setup() {
      const split = new SplitType(scope.current, {
        split: "words",
        wordClass: "blur-[--blur]",
      })

      if (!split.words) {
        return split.revert
      }

      const cleanup = scroll(
        animate(
          split.words.map((word) => [
            word,
            {
              opacity: [0, 1],
              "--blur": ["4px", "0px"],
            },
          ]),
        ),
        {
          target: scope.current,
          offset: ["start center", "end end"],
        },
      )

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
  }, [animate, scope])

  useEffect(() => {
    // const split = new SplitType(scope.current, {
    //   split: "words",
    //   wordClass: "blur-[--blur]",
    // })
    // if (!split.words) {
    //   return split.revert()
    // }
    // const stop = scroll(
    //   animate(
    //     split.words.map((word) => [
    //       word,
    //       {
    //         opacity: [0, 1],
    //         "--blur": ["4px", "0px"],
    //       },
    //     ]),
    //   ),
    //   {
    //     target: scope.current,
    //     offset: ["start center", "end end"],
    //   },
    // )
    // const measure = onMeasure(scope.current, () => {
    //   console.log("e")
    //   split.split()
    //   rect
    // })
    // return () => {
    //   split.revert()
    //   stop()
    // }
  }, [animate, scope])

  return <ark.div {...props} ref={mergeRefs([ref, scope])} />
}

export default forwardRef(TextAnimation)
