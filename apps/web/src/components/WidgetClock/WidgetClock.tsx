import { Suspense } from "react"

import { wait } from "~/lib/utils"

async function Content() {
  await wait(300)

  return <div className="h-full w-full bg-theme-50" />
}

function Fallback() {
  return <div className="h-full w-full bg-theme-700" />
}

export default function WidgetClock() {
  return (
    <div className="col-span-2">
      <div className="relative overflow-hidden rounded-full pb-[100%] shadow-card">
        <div className="absolute inset-0">
          <Suspense fallback={<Fallback />}>
            <Content />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
