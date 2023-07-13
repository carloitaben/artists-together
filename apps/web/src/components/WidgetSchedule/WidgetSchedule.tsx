import dynamic from "next/dynamic"

const WidgetScheduleContent = dynamic(() => import("./WidgetScheduleContent"), {
  loading: () => <Fallback />,
  ssr: false,
})

function Fallback() {
  return <div className="h-full w-full bg-theme-700" />
}

export default function WidgetSchedule() {
  return (
    <div className="col-span-2">
      <div className="relative overflow-hidden pb-[100%] shadow-card fluid:rounded-5xl">
        <div className="absolute inset-0">
          <WidgetScheduleContent />
        </div>
      </div>
    </div>
  )
}
