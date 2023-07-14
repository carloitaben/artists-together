import dynamic from "next/dynamic"

import { oneOf } from "~/lib/utils"
import { locations } from "~/data/locations"

const WidgetClockContent = dynamic(() => import("./WidgetClockContent"), {
  loading: () => <Fallback />,
  ssr: false,
})

function Fallback() {
  return <div className="absolute inset-0 bg-theme-700" />
}

export type Timezone = {
  name: string
  code: string
}

export default function WidgetClock() {
  const location = oneOf(locations)

  return (
    <div className="col-span-2">
      <article className="relative overflow-hidden rounded-full pb-[100%] shadow-card">
        <WidgetClockContent location={location} />
      </article>
    </div>
  )
}
