import * as v from "valibot"
import { redirect } from "next/navigation"
import { MonthNumberToName } from "~/lib/schemas"

export async function GET() {
  const date = new Date()
  const year = date.getFullYear()
  const month = v.parse(MonthNumberToName, date.getMonth() + 1)
  return redirect(`/calendar/${year}/${month}`)
}
