"use client"

import SplitType from "split-type"
import type { HTMLArkProps } from "@ark-ui/react/factory"
import { ark } from "@ark-ui/react/factory"
import type { ComponentRef, ForwardedRef } from "react"
import { forwardRef, useEffect } from "react"
import { mergeRefs } from "react-merge-refs"
import { scroll, useAnimate, useInView } from "motion/react"

type Props = HTMLArkProps<"div">

function TextAnimation(props: Props, ref: ForwardedRef<ComponentRef<"div">>) {
  const [scope, animate] = useAnimate<ComponentRef<"div">>()
  const inView = useInView(scope)

  useEffect(() => {
    if (!inView) return

    const split = new SplitType(scope.current, {
      split: "words",
      wordClass: "blur-[--blur]",
    })

    if (!split.words) {
      return split.revert()
    }

    const stop = scroll(
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
      split.revert()
      stop()
    }
  }, [animate, inView, scope])

  return <ark.div {...props} ref={mergeRefs([ref, scope])} />
}

export default forwardRef(TextAnimation)
