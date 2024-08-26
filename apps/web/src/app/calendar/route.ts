import { redirect } from "next/navigation"
import { monthNumberSchema } from "~/lib/schemas"

export async function GET() {
  const now = new Date()
  const year = now.getFullYear()
  const month = monthNumberSchema.parse(now.getMonth() + 1)
  return redirect(`/calendar/${year}/${month}`)
}
