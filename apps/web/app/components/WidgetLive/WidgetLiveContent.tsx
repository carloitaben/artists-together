import type { SerializeFrom } from "@remix-run/node"
import type { loader } from "~/routes/api.live-user"

type Props = {
  user: SerializeFrom<typeof loader>
}

export default function WidgetLiveContent({ user }: Props) {
  if (!user) {
    return (
      <div className="w-full h-full bg-theme-700 font-serif">
        Currently offline
        <br />
        come back later!
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-theme-700 font-serif">
      Show livestream: {user.url}
    </div>
  )
}
