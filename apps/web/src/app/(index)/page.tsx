import { saveData } from "~/lib/headers"

export default function Page() {
  return (
    <div>
      <div>save data? {saveData() ? "yes" : "no"}</div>
      <div>Inter</div>
      <div className="font-serif">Fraunces</div>
    </div>
  )
}
