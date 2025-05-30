import { lazy, Suspense } from "react"
import AspectRatio from "~/components/AspectRatio"
import { CursorPrecision } from "~/components/Cursors"
import { getRandomLiveUsers } from "~/features/live-user/server"

const WidgetLiveContent = lazy(() => import("./WidgetLiveContent"))

export default function WidgetLive() {
  const users = getRandomLiveUsers()

  return (
    <div className="col-span-4">
      <CursorPrecision id="widget-live" asChild>
        <AspectRatio.Root
          ratio={16 / 9}
          className="select-none overflow-hidden rounded-6 bg-arpeggio-black-800 shadow-card"
        >
          <AspectRatio.Content>
            <Suspense>
              <WidgetLiveContent usersPromise={users} />
            </Suspense>
          </AspectRatio.Content>
        </AspectRatio.Root>
      </CursorPrecision>
    </div>
  )
}
