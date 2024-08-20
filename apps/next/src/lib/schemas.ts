import { z } from "zod"

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()])

type Literal = z.infer<typeof literalSchema>

type Json = Literal | { [key: string]: Json } | Json[]

export const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
)

export const pathnameSchema = z
  .string()
  .default("/")
  .refine((value) => value.startsWith("/"), {
    message: "Pathname must start with a /",
  })

export const monthEnumSchema = z.enum([
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
export const monthNumberSchema = z
  .number()
  .min(1)
  .max(monthEnumSchema.options.length)
  .transform((value, context) => {
    const option = monthEnumSchema.options[value - 1]

    if (!option) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `No duplicates allowed.`,
      })

      return z.NEVER
    }

    return option
  })

/**
 * An integer, between 1 and 12, representing a month,
 * or a month name.
 */
export const monthSchema = z.union([
  monthEnumSchema,
  z.coerce.number().pipe(monthNumberSchema),
])
