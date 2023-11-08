import { Suspense, lazy } from "react"
import * as AspectRatio from "@radix-ui/react-aspect-ratio"
import type { loader } from "~/routes/api.last-instagram-post"
import { useQuery } from "~/hooks/query"
import ClientOnly from "~/components/ClientOnly"

const WidgetInstagramContent = lazy(() => import("./WidgetInstagramContent"))

export default function WidgetInstagram() {
  const { data = null, loading } = useQuery<typeof loader>({
    route: "/api/last-instagram-post",
  })

  return (
    <div className="col-span-4 select-none sm:col-span-3">
      <AspectRatio.Root
        ratio={1}
        className="overflow-hidden rounded-3xl shadow-card"
      >
        <ClientOnly
          show={!loading}
          fallback={<div className="w-full h-full bg-theme-700" />}
        >
          <Suspense>
            <WidgetInstagramContent data={data!} />
          </Suspense>
        </ClientOnly>
      </AspectRatio.Root>
    </div>
  )
}
