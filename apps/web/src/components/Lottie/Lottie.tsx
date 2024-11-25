import type {
  ComponentProps,
  ComponentRef,
  ForwardedRef,
  ReactNode,
} from "react"
import { Suspense, lazy, forwardRef } from "react"
import { ErrorBoundary } from "react-error-boundary"
import type LottieComponent from "./LottieComponent"
import ClientOnly from "../ClientOnly"

const LazyLottieComponent = lazy(() => import("./LottieComponent"))

type Props = Omit<ComponentProps<typeof LottieComponent>, "src"> & {
  /**
   * A dynamic import with the Lottie JSON animation
   */
  src: () => Promise<{ default: unknown }>
  fallback?: ReactNode
  errorFallback?: ReactNode
}

function Lottie(
  { src, fallback = null, errorFallback = fallback, ...props }: Props,
  ref: ForwardedRef<ComponentRef<typeof LottieComponent>>,
) {
  return (
    <Suspense fallback={fallback}>
      <ClientOnly fallback={fallback}>
        <ErrorBoundary fallback={errorFallback}>
          <LazyLottieComponent
            {...props}
            ref={ref}
            src={src().then((module) => module.default)}
          />
        </ErrorBoundary>
      </ClientOnly>
    </Suspense>
  )
}

export default forwardRef(Lottie)
