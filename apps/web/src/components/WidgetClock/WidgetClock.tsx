import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import dynamic from "next/dynamic"

import { oneOf } from "~/lib/utils"

dayjs.extend(utc)
dayjs.extend(timezone)

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

// https://github.com/omsrivastava/timezones-list/blob/master/src/timezones.json
const timezones: Timezone[] = [
  {
    name: "Toronto, Canada",
    code: "America/Toronto",
  },
  {
    name: "Lisbon, Portugal",
    code: "Europe/Lisbon",
  },
  {
    name: "Canberra, Australia",
    code: "Australia/Sydney",
  },
  {
    name: "Sapporo, Japan",
    code: "Asia/Tokyo",
  },
]

export default function WidgetClock() {
  const timezone = oneOf(timezones)

  return (
    <div className="col-span-2">
      <article className="relative overflow-hidden rounded-full pb-[100%] shadow-card">
        <WidgetClockContent timezone={timezone} />
      </article>
    </div>
  )
}
