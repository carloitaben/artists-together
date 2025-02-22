import AspectRatio from "~/components/AspectRatio"
import { CursorPrecision } from "~/components/Cursors"

export default function WidgetInstagram() {
  return (
    <div className="col-span-3">
      <CursorPrecision id="widget-instagram" asChild>
        <AspectRatio.Root
          ratio={1}
          className="select-none overflow-hidden rounded-6 bg-arpeggio-black-800 shadow-card"
        />
      </CursorPrecision>
    </div>
  )
}
