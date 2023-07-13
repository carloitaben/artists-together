import dynamic from "next/dynamic"

const WidgetClockContent = dynamic(() => import("./WidgetClockContent"), {
  loading: () => <Fallback />,
  ssr: false,
})

function Fallback() {
  return <div className="absolute inset-0 bg-theme-700" />
}

export default function WidgetClock() {
  return (
    <div className="col-span-2">
      <article className="relative overflow-hidden rounded-full pb-[100%] shadow-card">
        <WidgetClockContent />
      </article>
    </div>
  )
}
