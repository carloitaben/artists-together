import type { AnimationConfigWithData } from "lottie-web"
import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { Suspense, lazy } from "react"

const LottieComponent = lazy(() => import("./LottieComponent"))

type Props = ComponentPropsWithoutRef<"div"> &
  Pick<AnimationConfigWithData, "autoplay" | "loop"> & {
    src: () => Promise<{ default: unknown }>
    fallback?: ReactNode
  }

export default function Lottie({ src, fallback = null, ...props }: Props) {
  return (
    <Suspense fallback={fallback}>
      <LottieComponent
        {...props}
        src={src().then((module) => module.default)}
      />
    </Suspense>
  )
}
