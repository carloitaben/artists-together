import { redirect } from "next/navigation"
import { MonthNumber } from "~/lib/schemas"

export async function GET() {
  const now = new Date()
  const year = now.getFullYear()
  const month = MonthNumber.parse(now.getMonth() + 1)
  return redirect(`/calendar/${year}/${month}`)
}
