import { z } from "zod"

const AnyJSONLiteral = z.union([z.string(), z.number(), z.boolean(), z.null()])

type AnyJSONLiteral = z.infer<typeof AnyJSONLiteral>

type AnyJSON = AnyJSONLiteral | { [key: string]: AnyJSON } | AnyJSON[]

export const AnyJSON: z.ZodType<AnyJSON> = z.lazy(() =>
  z.union([AnyJSONLiteral, z.array(AnyJSON), z.record(AnyJSON)]),
)

export const Pathname = z
  .string()
  .default("/")
  .refine((value) => value.startsWith("/"), {
    message: "Pathname must start with a /",
  })

export const MonthEnum = z.enum([
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
])

/**
 * An integer, between 1 and 12, representing a month
 */
export const MonthNumber = z.coerce
  .number()
  .min(1)
  .max(MonthEnum.options.length)
  .transform((value, context) => {
    const option = MonthEnum.options[value - 1]

    if (!option) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Out of range`,
      })

      return z.NEVER
    }

    return option
  })

/**
 * An integer, between 1 and 12, representing a month,
 * or a month name.
 */
export const Month = z.union([MonthEnum, z.coerce.number().pipe(MonthNumber)])
