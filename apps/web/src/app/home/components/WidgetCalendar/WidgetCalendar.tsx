import AspectRatio from "~/components/AspectRatio"
import { CursorPrecision } from "~/components/Cursors"

export default function WidgetCalendar() {
  return (
    <div className="col-span-2">
      <CursorPrecision id="widget-calendar" asChild>
        <AspectRatio.Root
          ratio={1}
          className="select-none overflow-hidden bg-gunpla-white-50 shadow-card scale:rounded-16"
        />
      </CursorPrecision>
    </div>
  )
}
