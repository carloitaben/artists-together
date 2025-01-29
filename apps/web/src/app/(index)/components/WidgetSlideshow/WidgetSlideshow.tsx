import { lazy, Suspense } from "react"
import { getRandomContentShared } from "~/services/content-shared/server"
import { CursorPrecision } from "~/components/Cursors"
import AspectRatio from "~/components/AspectRatio"

const WidgetSlideshowContent = lazy(() => import("./WidgetSlideshowContent"))

export default function WidgetSlideshow() {
  const promise = getRandomContentShared()

  return (
    <div className="col-span-3">
      <CursorPrecision id="widget-slideshow" asChild>
        <AspectRatio.Root
          ratio={1}
          className="overflow-hidden rounded-6 bg-arpeggio-black-800 shadow-card"
        >
          <AspectRatio.Content>
            <Suspense>
              <WidgetSlideshowContent promise={promise} />
            </Suspense>
          </AspectRatio.Content>
        </AspectRatio.Root>
      </CursorPrecision>
    </div>
  )
}
