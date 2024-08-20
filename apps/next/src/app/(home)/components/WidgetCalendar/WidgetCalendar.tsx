import AspectRatio from "~/components/AspectRatio"

export default function WidgetCalendar() {
  return (
    <div className="col-span-2">
      <AspectRatio.Root
        ratio={1}
        className="select-none overflow-hidden bg-gunpla-white-50 shadow-card scale:rounded-16"
      />
    </div>
  )
}
