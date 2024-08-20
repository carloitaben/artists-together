import { Suspense } from "react"
import { getRandomLiveUsers } from "~/services/live-user/server"
import AspectRatio from "~/components/AspectRatio"
import WidgetLiveContent from "./WidgetLiveContent"

export default function WidgetLive() {
  const users = getRandomLiveUsers()

  return (
    <div className="col-span-4">
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
    </div>
  )
}
