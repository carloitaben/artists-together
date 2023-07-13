import { Suspense } from "react"
import { connect, discordLiveUsers } from "db"

import { oneOf } from "~/lib/utils"

async function Content() {
  const db = connect({
    fetch: (input, init) =>
      fetch(input, {
        ...init,
        cache: undefined,
        next: { revalidate: 60 },
      }),
  })

  const users = await db
    .select({ url: discordLiveUsers.url })
    .from(discordLiveUsers)

  if (!users.length) {
    return (
      <div className="h-full w-full bg-theme-700 font-serif">
        Currently offline
        <br />
        come back later!
      </div>
    )
  }

  const user = oneOf(users)

  return (
    <div className="h-full w-full bg-theme-700">
      Show livestream: {user.url}
    </div>
  )
}

function Fallback() {
  return <div className="h-full w-full bg-theme-700" />
}

export default function WidgetLive() {
  return (
    <div className="col-span-4">
      <div className="relative overflow-hidden rounded-3xl pb-[56.25%] shadow-card">
        <div className="absolute inset-0">
          <Suspense fallback={<Fallback />}>
            <Content />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
