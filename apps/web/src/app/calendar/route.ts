import { $path } from "next-typesafe-url"
import { redirect } from "next/navigation"
import { monthNumberSchema } from "~/lib/schemas"

export async function GET() {
  const now = new Date()

  return redirect(
    $path({
      route: "/calendar/[year]/[month]",
      routeParams: {
        year: now.getFullYear(),
        month: monthNumberSchema.parse(now.getMonth() + 1),
      },
    }),
  )
}
