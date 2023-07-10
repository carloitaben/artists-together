import { Suspense } from "react"

import { wait } from "~/lib/utils"

async function Content() {
  await wait(500)

  return <div className="h-full w-full bg-theme-300" />
}

function Fallback() {
  return <div className="h-full w-full bg-theme-700" />
}

export default function WidgetTheme() {
  return (
    <div className="col-span-4">
      <div className="relative overflow-hidden rounded-3xl pb-[56.25%] shadow-card">
        <div className="absolute inset-0">
          <Suspense fallback={<Fallback />}>
            <Content />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
