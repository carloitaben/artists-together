import type {
  ComponentProps,
  ComponentRef,
  ForwardedRef,
  ReactNode,
} from "react"
import { Suspense, lazy, forwardRef } from "react"
import type LottieComponent from "./LottieComponent"
import ClientOnly from "../ClientOnly"

const LazyLottieComponent = lazy(() => import("./LottieComponent"))

type Props = Omit<ComponentProps<typeof LottieComponent>, "src"> & {
  /**
   * A dynamic import with the Lottie JSON animation
   */
  src: () => Promise<{ default: unknown }>
  fallback?: ReactNode
}

function Lottie(
  { src, fallback = null, ...props }: Props,
  ref: ForwardedRef<ComponentRef<typeof LottieComponent>>,
) {
  return (
    <Suspense fallback={fallback}>
      <ClientOnly fallback={fallback}>
        <LazyLottieComponent
          {...props}
          ref={ref}
          src={src().then((module) => module.default)}
        />
      </ClientOnly>
    </Suspense>
  )
}

export default forwardRef(Lottie)
