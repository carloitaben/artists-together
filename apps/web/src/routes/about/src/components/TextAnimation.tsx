import SplitType from "split-type"
import type { HTMLArkProps } from "@ark-ui/react/factory"
import { ark } from "@ark-ui/react/factory"
import type { ComponentRef } from "react"
import { useEffect } from "react"
import { mergeRefs } from "react-merge-refs"
import type { Segment } from "motion/react"
import { useAnimate, useInView, useScroll, useSpring } from "motion/react"

type Props = HTMLArkProps<"div">

export default function TextAnimation(props: Props) {
  const [scope, animate] = useAnimate<ComponentRef<"div">>()
  const inView = useInView(scope)
  const scroll = useScroll({
    target: scope,
    offset: ["start center", "end end"],
  })

  const scrollSpring = useSpring(scroll.scrollYProgress, {
    mass: 0.01,
  })

  useEffect(() => {
    if (!inView) return

    const split = new SplitType(scope.current, {
      split: "words",
      wordClass: "blur-[--blur]",
    })

    if (!split.words) {
      return split.revert()
    }

    const animation = animate(
      split.words.map<Segment>((word) => [
        word,
        {
          opacity: [0, 1],
          "--blur": ["4px", "0px"],
        },
      ]),
      {
        duration: 1,
      },
    )

    animation.pause()

    function scrub(progress: number) {
      animation.time = progress
    }

    const stop = scrollSpring.on("change", scrub)

    return () => {
      stop()
      animation.stop()
      split.revert()
    }
  }, [animate, scope, inView, scrollSpring])

  return <ark.div ref={mergeRefs([props.ref, scope])} {...props} />
}
