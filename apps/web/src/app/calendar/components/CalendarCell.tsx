import { Suspense } from "react"
import { getCalendarMonthData } from "~/services/calendar/server"

type Props = {
  promise: ReturnType<typeof getCalendarMonthData>
}

async function CalendarCellComponent({ promise }: Props) {
  const data = await promise

  return (
    <div>
      <div>Calendar cell: {JSON.stringify(data)}</div>
    </div>
  )
}

export default function CalendarCell() {
  const promise = getCalendarMonthData()

  return (
    <Suspense fallback={<div>Empty calendar cell</div>}>
      <CalendarCellComponent promise={promise} />
    </Suspense>
  )
}
