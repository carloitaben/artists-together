import { useSuspenseQuery } from "@tanstack/react-query"
import type { ComponentProps, ComponentRef, ForwardedRef } from "react"
import { forwardRef } from "react"
import { hintsQueryOptions } from "~/services/hints/shared"
import AspectRatio from "./AspectRatio"
import Icon from "./Icon"
import Lottie from "./Lottie"

type Props = Omit<ComponentProps<typeof AspectRatio.Root>, "ratio">

function Logo(
  props: Props,
  ref: ForwardedRef<ComponentRef<typeof AspectRatio.Root>>,
) {
  const hints = useSuspenseQuery(hintsQueryOptions)

  return (
    <AspectRatio.Root {...props} ref={ref} ratio={2 / 1}>
      <AspectRatio.Content>
        <h2 className="sr-only">Artists Together</h2>
        {hints.data.saveData ? (
          <Icon src="Logo" alt="" className="size-full" />
        ) : (
          <>
            <noscript>
              <Icon src="Logo" alt="" className="size-full" />
            </noscript>
            <Icon
              src="Logo"
              alt=""
              className="hidden size-full motion-reduce:block"
            />
            <Lottie
              src={() => import("~/assets/lottie/logo-w.json")}
              autoplay
              className="motion-reduce:hidden"
              errorFallback={<Icon src="Logo" alt="" className="size-full" />}
            />
          </>
        )}
      </AspectRatio.Content>
    </AspectRatio.Root>
  )
}

export default forwardRef(Logo)
