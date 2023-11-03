import { Suspense, lazy } from "react"
import type { SerializeFrom } from "@remix-run/node"
import * as AspectRatio from "@radix-ui/react-aspect-ratio"
import type { loader } from "~/routes/api.live-user"
import { useQuery } from "~/hooks/query"
import ClientOnly from "~/components/ClientOnly"

const WidgetLiveContent = lazy(() => import("./WidgetLiveContent"))

export default function WidgetLive() {
  const { data = null, loading } = useQuery<SerializeFrom<typeof loader>>({
    route: "/api/live-user",
  })

  return (
    <div className="col-span-4 select-none sm:col-span-3">
      <AspectRatio.Root
        ratio={16 / 9}
        className="overflow-hidden fluid:rounded-3xl shadow-card"
      >
        <ClientOnly
          show={!loading}
          fallback={<div className="w-full h-full bg-theme-700" />}
        >
          <Suspense>
            <WidgetLiveContent user={data} />
          </Suspense>
        </ClientOnly>
      </AspectRatio.Root>
    </div>
  )
}
