import { Suspense } from "react"

import { wait } from "~/lib/utils"

async function Content() {
  await wait(1500)

  return <div className="h-full w-full bg-theme-50" />
}

function Fallback() {
  return <div className="h-full w-full bg-theme-700" />
}

export default function WidgetWeather() {
  return (
    <div className="col-span-3">
      <div className="relative overflow-hidden rounded-l-5xl rounded-r-full pb-[43.6764705882%] shadow-card">
        <div className="absolute inset-0">
          <Suspense fallback={<Fallback />}>
            <Content />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
