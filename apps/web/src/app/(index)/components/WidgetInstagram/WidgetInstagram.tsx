import AspectRatio from "~/components/AspectRatio"

export default function WidgetInstagram() {
  return (
    <div className="col-span-3">
      <AspectRatio.Root
        ratio={1}
        className="select-none overflow-hidden rounded-6 bg-arpeggio-black-800 shadow-card"
      />
    </div>
  )
}
