import dayjs from "dayjs"
import { z } from "zod"
import type { ReadonlyURLSearchParams } from "next/navigation"

const paramsSchema = z.object({
  year: z.coerce.number().min(1970),
})

type Params = z.output<typeof paramsSchema>

type Props = {
  params: Params
  searchParams: ReadonlyURLSearchParams
}

export default function Page({ params }: Props) {
  const parsedParams = paramsSchema.parse(params)
  const date = dayjs().set("year", parsedParams.year)

  return <div>calendar {date.format("YYYY")}</div>
}
