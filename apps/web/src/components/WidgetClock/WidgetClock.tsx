import dynamic from "next/dynamic"

import { oneOf } from "~/lib/utils"
import { getLocations } from "~/lib/geo"

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

export default async function WidgetClock() {
  const locations = await getLocations()
  const location = oneOf(locations)

  return (
    <div className="col-span-2 select-none">
      <article className="relative overflow-hidden rounded-full pb-[100%] shadow-card">
        <WidgetClockContent location={location} />
      </article>
    </div>
  )
}
